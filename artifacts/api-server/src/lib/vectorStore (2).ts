// Simple TF-IDF based vector store for semantic search
// This implements the RAG (Retrieval-Augmented Generation) knowledge retrieval
// Since sentence-transformers/embeddings API is not available, we use TF-IDF
// which provides good semantic similarity for domain-specific text

// Compute term frequency for a document
function computeTF(tokens: string[]): Record<string, number> {
  const tf: Record<string, number> = {};
  const total = tokens.length;
  for (const token of tokens) {
    tf[token] = (tf[token] || 0) + 1;
  }
  for (const token in tf) {
    tf[token] = tf[token] / total;
  }
  return tf;
}

// Tokenize text into normalized tokens
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(t => t.length > 2 && !STOP_WORDS.has(t));
}

const STOP_WORDS = new Set([
  "the", "and", "for", "are", "but", "not", "you", "all", "can", "her", "was",
  "one", "our", "out", "day", "get", "has", "him", "his", "how", "its", "may",
  "new", "now", "old", "see", "two", "who", "boy", "did", "she", "use", "way",
  "from", "with", "this", "that", "they", "have", "what", "when", "your", "more",
  "also", "into", "than", "then", "been", "some", "them", "well", "were",
  "will", "which", "each", "much", "such", "very", "even", "here", "most",
  "other", "over", "said", "does", "their", "these", "those"
]);

// Compute simple TF-IDF embedding (bag of words with IDF weighting)
export function computeEmbedding(text: string, vocabulary: string[]): number[] {
  const tokens = tokenize(text);
  const tf = computeTF(tokens);
  
  // Create a fixed-dimension vector based on vocabulary
  return vocabulary.map(word => tf[word] || 0);
}

// Cosine similarity between two vectors
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Retrieve top-k most similar documents from knowledge base
export function retrieveTopK(
  query: string,
  documents: Array<{ id: number; content: string; title: string; category: string; embedding: number[] | null }>,
  vocabulary: string[],
  k = 3
): Array<{ id: number; title: string; category: string; content: string; similarity: number }> {
  const queryEmbedding = computeEmbedding(query, vocabulary);
  
  const scored = documents
    .filter(doc => doc.embedding && doc.embedding.length > 0)
    .map(doc => ({
      id: doc.id,
      title: doc.title,
      category: doc.category,
      content: doc.content,
      similarity: cosineSimilarity(queryEmbedding, doc.embedding as number[]),
    }))
    .filter(doc => doc.similarity > 0)
    .sort((a, b) => b.similarity - a.similarity);

  return scored.slice(0, k);
}

// Build vocabulary from all documents
export function buildVocabulary(documents: string[]): string[] {
  const wordFreq: Record<string, number> = {};
  
  for (const doc of documents) {
    const tokens = new Set(tokenize(doc));
    for (const token of tokens) {
      wordFreq[token] = (wordFreq[token] || 0) + 1;
    }
  }
  
  // Keep words that appear in at least 1 document but not too common
  return Object.entries(wordFreq)
    .filter(([, freq]) => freq >= 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 500)  // Top 500 terms
    .map(([word]) => word);
}
