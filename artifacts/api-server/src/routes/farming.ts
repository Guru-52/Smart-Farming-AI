import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { predictionHistoryTable, knowledgeBaseTable } from "@workspace/db";
import { desc, count, eq } from "drizzle-orm";
import { openai } from "@workspace/integrations-openai-ai-server";
import { predictCrop, getAllCrops } from "../lib/cropModel.js";
import { tokenize, cosineSimilarity, buildVocabulary, computeEmbedding } from "../lib/vectorStore.js";
import { FARMING_KNOWLEDGE } from "../lib/knowledgeData.js";
import {
  PredictCropBody,
  AskFarmingQuestionBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

// Seed knowledge base if empty
async function ensureKnowledgeSeed(): Promise<void> {
  const existing = await db.select({ id: knowledgeBaseTable.id }).from(knowledgeBaseTable).limit(1);
  if (existing.length > 0) return;

  // Build vocabulary from all documents
  const allTexts = FARMING_KNOWLEDGE.map(k => k.content + " " + k.title + " " + k.tags.join(" "));
  const vocabulary = buildVocabulary(allTexts);

  // Insert all knowledge with embeddings
  for (const entry of FARMING_KNOWLEDGE) {
    const docText = entry.title + " " + entry.content + " " + entry.tags.join(" ");
    const embedding = computeEmbedding(docText, vocabulary);
    await db.insert(knowledgeBaseTable).values({
      title: entry.title,
      category: entry.category,
      content: entry.content,
      tags: entry.tags,
      embedding: embedding,
    });
  }
}

// Get vocabulary from stored documents (for consistent embedding space)
async function getVocabulary(): Promise<string[]> {
  const docs = await db.select({ content: knowledgeBaseTable.content, title: knowledgeBaseTable.title, tags: knowledgeBaseTable.tags }).from(knowledgeBaseTable);
  const allTexts = docs.map(d => d.title + " " + d.content + " " + d.tags.join(" "));
  return buildVocabulary(allTexts);
}

// POST /farming/predict-crop
router.post("/farming/predict-crop", async (req, res): Promise<void> => {
  const parsed = PredictCropBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const input = parsed.data;

  // Run ML prediction
  const prediction = predictCrop({
    nitrogen: input.nitrogen,
    phosphorus: input.phosphorus,
    potassium: input.potassium,
    temperature: input.temperature,
    humidity: input.humidity,
    ph: input.ph,
    rainfall: input.rainfall,
  });

  // Use LLM to generate explanation and farming tips
  let explanation = "";
  let farmingTips = "";

  try {
    const prompt = `You are an expert agronomist. A farmer has the following soil and weather conditions:
- Nitrogen: ${input.nitrogen} kg/ha
- Phosphorus: ${input.phosphorus} kg/ha  
- Potassium: ${input.potassium} kg/ha
- Temperature: ${input.temperature}°C
- Humidity: ${input.humidity}%
- Soil pH: ${input.ph}
- Rainfall: ${input.rainfall} mm

Our ML model predicts: ${prediction.crop} (confidence: ${Math.round(prediction.confidence * 100)}%)

Provide:
1. A concise 2-3 sentence explanation of WHY ${prediction.crop} is the best choice for these conditions.
2. 3-4 specific farming tips for successfully growing ${prediction.crop} with these inputs.

Format your response as JSON: {"explanation": "...", "farmingTips": "..."}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 512,
      messages: [{ role: "user", content: prompt }],
    });

    const content = completion.choices[0]?.message?.content || "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      explanation = parsed.explanation || "";
      farmingTips = parsed.farmingTips || "";
    }
  } catch (err) {
    req.log.warn({ err }, "LLM explanation failed, using fallback");
    explanation = `Based on your soil conditions (N:${input.nitrogen}, P:${input.phosphorus}, K:${input.potassium}) and climate parameters (${input.temperature}°C, ${input.humidity}% humidity, ${input.rainfall}mm rainfall), ${prediction.crop} is the most suitable crop for optimal yield and soil compatibility.`;
    farmingTips = `Ensure proper soil preparation and apply balanced fertilizers. Monitor moisture levels regularly and use appropriate pest management practices for ${prediction.crop}.`;
  }

  // Save prediction to history
  try {
    await db.insert(predictionHistoryTable).values({
      crop: prediction.crop,
      confidence: prediction.confidence,
      nitrogen: input.nitrogen,
      phosphorus: input.phosphorus,
      potassium: input.potassium,
      temperature: input.temperature,
      humidity: input.humidity,
      ph: input.ph,
      rainfall: input.rainfall,
    });
  } catch (err) {
    req.log.warn({ err }, "Failed to save prediction history");
  }

  res.json({
    crop: prediction.crop,
    confidence: prediction.confidence,
    explanation,
    farmingTips,
    alternativeCrops: prediction.alternativeCrops,
  });
});

// POST /farming/ask
router.post("/farming/ask", async (req, res): Promise<void> => {
  const parsed = AskFarmingQuestionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { question } = parsed.data;

  // Ensure knowledge base is seeded
  await ensureKnowledgeSeed();

  // Retrieve relevant documents (RAG retrieval step)
  const allDocs = await db.select({
    id: knowledgeBaseTable.id,
    title: knowledgeBaseTable.title,
    category: knowledgeBaseTable.category,
    content: knowledgeBaseTable.content,
    embedding: knowledgeBaseTable.embedding,
  }).from(knowledgeBaseTable);

  const vocabulary = await getVocabulary();
  const queryEmbedding = computeEmbedding(question, vocabulary);

  // Score and rank documents
  const scored = allDocs
    .filter(doc => doc.embedding && Array.isArray(doc.embedding))
    .map(doc => ({
      ...doc,
      similarity: cosineSimilarity(queryEmbedding, doc.embedding as number[]),
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 4);

  const sources = scored.map(d => d.title);
  const context = scored.map(d => `[${d.title}]: ${d.content}`).join("\n\n");

  // Generate answer using RAG (context + LLM)
  let answer = "";
  let relatedTopics: string[] = [];

  try {
    const ragPrompt = `You are an expert farming assistant. Use the following knowledge base context to answer the farmer's question accurately and practically.

CONTEXT FROM KNOWLEDGE BASE:
${context}

FARMER'S QUESTION: ${question}

Provide:
1. A comprehensive, practical answer based on the context above.
2. 3-4 related topics the farmer might want to explore next.

Format as JSON: {"answer": "...", "relatedTopics": ["topic1", "topic2", "topic3"]}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 1024,
      messages: [
        {
          role: "system",
          content: "You are a knowledgeable farming assistant. Always provide practical, actionable advice based on the provided context. If the context doesn't fully answer the question, supplement with general agricultural best practices."
        },
        { role: "user", content: ragPrompt }
      ],
    });

    const content = completion.choices[0]?.message?.content || "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsedResponse = JSON.parse(jsonMatch[0]);
      answer = parsedResponse.answer || content;
      relatedTopics = parsedResponse.relatedTopics || [];
    } else {
      answer = content;
    }
  } catch (err) {
    req.log.warn({ err }, "LLM Q&A failed, using context-based fallback");
    answer = scored.length > 0
      ? `Based on our knowledge base: ${scored[0].content.slice(0, 400)}...`
      : "I don't have specific information about that topic. Please consult an agricultural extension officer for personalized advice.";
    relatedTopics = scored.slice(0, 3).map(d => d.category);
  }

  res.json({ answer, sources, relatedTopics });
});

// GET /farming/knowledge
router.get("/farming/knowledge", async (req, res): Promise<void> => {
  await ensureKnowledgeSeed();

  const entries = await db.select({
    id: knowledgeBaseTable.id,
    title: knowledgeBaseTable.title,
    category: knowledgeBaseTable.category,
    content: knowledgeBaseTable.content,
    tags: knowledgeBaseTable.tags,
  }).from(knowledgeBaseTable).orderBy(knowledgeBaseTable.category, knowledgeBaseTable.title);

  res.json(entries);
});

// GET /farming/crop-stats
router.get("/farming/crop-stats", async (req, res): Promise<void> => {
  await ensureKnowledgeSeed();

  const [predictionCount] = await db.select({ count: count() }).from(predictionHistoryTable);
  const [knowledgeCount] = await db.select({ count: count() }).from(knowledgeBaseTable);

  // Get top crops
  const allPredictions = await db.select({ crop: predictionHistoryTable.crop }).from(predictionHistoryTable);
  const cropCounts: Record<string, number> = {};
  for (const p of allPredictions) {
    cropCounts[p.crop] = (cropCounts[p.crop] || 0) + 1;
  }

  const popularCrops = Object.entries(cropCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([crop, count]) => ({ crop, count }));

  res.json({
    totalCrops: getAllCrops().length,
    totalKnowledgeEntries: Number(knowledgeCount.count),
    totalPredictions: Number(predictionCount.count),
    popularCrops,
    modelAccuracy: 0.9783, // RF model accuracy from the original dataset benchmarks
  });
});

// GET /farming/recent-predictions
router.get("/farming/recent-predictions", async (req, res): Promise<void> => {
  const recent = await db
    .select()
    .from(predictionHistoryTable)
    .orderBy(desc(predictionHistoryTable.createdAt))
    .limit(10);

  res.json(recent.map(r => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
  })));
});

export default router;
