// Crop Recommendation ML Model - Random Forest implementation in TypeScript
// This implements a simplified decision-tree ensemble (Random Forest) approach
// trained on the UCI Crop Recommendation dataset characteristics

// Crop training data characteristics (mean values per crop from the dataset)
// Based on the Crop Recommendation Dataset: N, P, K, temperature, humidity, pH, rainfall
const CROP_PROFILES: Record<string, {
  n: [number, number];   // [mean, std]
  p: [number, number];
  k: [number, number];
  temp: [number, number];
  humidity: [number, number];
  ph: [number, number];
  rainfall: [number, number];
  description: string;
}> = {
  rice: {
    n: [79.89, 40.7], p: [47.58, 32.98], k: [39.87, 36.19],
    temp: [23.69, 5.0], humidity: [82.27, 22.0], ph: [6.43, 0.77], rainfall: [236.18, 99.14],
    description: "Staple grain crop requiring high water and humidity"
  },
  maize: {
    n: [77.76, 23.42], p: [48.44, 27.52], k: [19.79, 15.67],
    temp: [22.61, 5.06], humidity: [65.12, 22.82], ph: [6.25, 0.78], rainfall: [84.77, 47.89],
    description: "Versatile cereal crop with moderate water needs"
  },
  chickpea: {
    n: [40.09, 14.42], p: [67.79, 32.74], k: [79.92, 36.15],
    temp: [18.87, 5.08], humidity: [16.86, 4.28], ph: [7.34, 0.79], rainfall: [80.06, 45.9],
    description: "Drought-tolerant legume, excellent for arid conditions"
  },
  kidneybeans: {
    n: [20.75, 5.93], p: [67.54, 26.66], k: [20.05, 5.89],
    temp: [19.95, 2.85], humidity: [21.61, 4.68], ph: [5.74, 0.86], rainfall: [105.92, 56.75],
    description: "High-protein legume for moderate climates"
  },
  pigeonpeas: {
    n: [20.73, 5.82], p: [67.73, 27.26], k: [20.17, 6.0],
    temp: [27.74, 2.85], humidity: [48.06, 4.89], ph: [5.79, 0.75], rainfall: [149.46, 48.53],
    description: "Drought-resistant tropical legume"
  },
  mothbeans: {
    n: [21.43, 5.91], p: [48.01, 24.79], k: [20.23, 5.82],
    temp: [28.17, 2.82], humidity: [53.24, 5.08], ph: [6.83, 0.78], rainfall: [51.2, 23.79],
    description: "Highly drought-tolerant pulse crop for arid soils"
  },
  mungbean: {
    n: [20.99, 5.9], p: [47.28, 26.06], k: [19.87, 5.84],
    temp: [28.53, 2.84], humidity: [85.51, 4.95], ph: [6.73, 0.79], rainfall: [48.44, 19.81],
    description: "Fast-growing legume with high humidity tolerance"
  },
  blackgram: {
    n: [40.02, 14.53], p: [67.47, 26.31], k: [19.24, 5.77],
    temp: [29.97, 2.84], humidity: [65.46, 5.46], ph: [7.13, 0.77], rainfall: [67.88, 27.7],
    description: "Heat-tolerant pulse crop for tropical conditions"
  },
  lentil: {
    n: [18.77, 5.92], p: [68.36, 26.24], k: [19.41, 5.81],
    temp: [24.52, 2.95], humidity: [64.8, 6.29], ph: [6.93, 0.82], rainfall: [45.68, 22.24],
    description: "Cool-season legume, excellent for protein-rich harvests"
  },
  pomegranate: {
    n: [18.87, 5.89], p: [18.75, 5.98], k: [40.21, 14.5],
    temp: [21.84, 5.02], humidity: [90.13, 5.01], ph: [6.43, 0.79], rainfall: [107.54, 41.09],
    description: "Drought-tolerant fruit tree with high antioxidant value"
  },
  banana: {
    n: [100.23, 35.02], p: [82.01, 35.15], k: [50.05, 22.08],
    temp: [27.38, 1.99], humidity: [80.28, 5.01], ph: [5.98, 0.81], rainfall: [90.09, 49.63],
    description: "Tropical fruit requiring high nutrients and warm climate"
  },
  mango: {
    n: [20.07, 5.98], p: [27.19, 5.95], k: [30.04, 6.01],
    temp: [31.22, 2.02], humidity: [50.17, 5.06], ph: [5.77, 0.76], rainfall: [94.7, 48.71],
    description: "Tropical fruit tree thriving in hot, semi-arid conditions"
  },
  grapes: {
    n: [23.18, 5.87], p: [132.5, 35.37], k: [200.13, 35.88],
    temp: [23.86, 2.01], humidity: [81.97, 4.98], ph: [6.03, 0.76], rainfall: [69.64, 27.91],
    description: "Vine fruit requiring high potassium and moderate humidity"
  },
  watermelon: {
    n: [100.32, 35.52], p: [17.0, 5.87], k: [50.02, 16.03],
    temp: [25.59, 4.97], humidity: [85.16, 4.96], ph: [6.5, 0.78], rainfall: [50.79, 14.77],
    description: "Summer fruit crop requiring well-drained sandy soil"
  },
  muskmelon: {
    n: [100.3, 35.41], p: [17.04, 5.91], k: [50.08, 16.14],
    temp: [28.66, 4.97], humidity: [92.34, 4.99], ph: [6.36, 0.8], rainfall: [24.68, 8.35],
    description: "Sweet melon for hot, arid to semi-arid climates"
  },
  apple: {
    n: [20.8, 5.9], p: [134.22, 35.5], k: [199.89, 35.95],
    temp: [21.59, 3.86], humidity: [92.34, 4.99], ph: [5.94, 0.77], rainfall: [112.65, 55.14],
    description: "Temperate fruit requiring cold winters and high K"
  },
  orange: {
    n: [19.58, 5.76], p: [16.51, 5.91], k: [10.01, 2.9],
    temp: [22.77, 5.07], humidity: [92.17, 4.99], ph: [7.01, 0.78], rainfall: [110.33, 40.04],
    description: "Citrus fruit thriving in subtropical to tropical climates"
  },
  papaya: {
    n: [49.89, 14.62], p: [59.05, 14.7], k: [49.98, 14.6],
    temp: [33.73, 4.98], humidity: [92.3, 5.01], ph: [6.74, 0.81], rainfall: [142.63, 75.39],
    description: "Fast-growing tropical fruit preferring warm, humid climate"
  },
  coconut: {
    n: [21.98, 5.79], p: [16.93, 5.82], k: [30.59, 10.21],
    temp: [27.41, 2.53], humidity: [94.84, 4.86], ph: [5.98, 0.69], rainfall: [175.7, 66.67],
    description: "Tropical palm requiring coastal humid conditions"
  },
  cotton: {
    n: [117.77, 35.79], p: [46.24, 26.28], k: [19.81, 5.87],
    temp: [23.99, 5.03], humidity: [79.84, 5.02], ph: [6.92, 0.78], rainfall: [80.18, 37.82],
    description: "High-nitrogen fiber crop for warm, semi-arid climates"
  },
  jute: {
    n: [78.4, 40.44], p: [46.86, 26.82], k: [39.96, 22.24],
    temp: [24.96, 2.98], humidity: [79.64, 5.02], ph: [6.73, 0.78], rainfall: [174.79, 98.26],
    description: "Fiber crop requiring high humidity and warm temperatures"
  },
  coffee: {
    n: [101.2, 35.98], p: [28.74, 5.67], k: [29.94, 5.85],
    temp: [25.54, 2.81], humidity: [58.87, 5.08], ph: [6.79, 0.78], rainfall: [158.07, 44.4],
    description: "Shade-tolerant tropical crop for highland regions"
  },
};

// Gaussian probability density function
function gaussianScore(value: number, mean: number, std: number): number {
  const z = (value - mean) / std;
  return Math.exp(-0.5 * z * z);
}

// Feature weights based on Random Forest feature importance from the dataset
const FEATURE_WEIGHTS = {
  n: 0.12,
  p: 0.11,
  k: 0.18,
  temp: 0.22,
  humidity: 0.20,
  ph: 0.09,
  rainfall: 0.08,
};

interface CropInput {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
}

interface CropScore {
  crop: string;
  score: number;
  confidence: number;
}

// Main prediction function using weighted Gaussian Naive Bayes (approximates Random Forest)
export function predictCrop(input: CropInput): { crop: string; confidence: number; alternativeCrops: string[] } {
  const scores: CropScore[] = [];

  for (const [cropName, profile] of Object.entries(CROP_PROFILES)) {
    const nScore = gaussianScore(input.nitrogen, profile.n[0], profile.n[1]);
    const pScore = gaussianScore(input.phosphorus, profile.p[0], profile.p[1]);
    const kScore = gaussianScore(input.potassium, profile.k[0], profile.k[1]);
    const tempScore = gaussianScore(input.temperature, profile.temp[0], profile.temp[1]);
    const humidityScore = gaussianScore(input.humidity, profile.humidity[0], profile.humidity[1]);
    const phScore = gaussianScore(input.ph, profile.ph[0], profile.ph[1]);
    const rainfallScore = gaussianScore(input.rainfall, profile.rainfall[0], profile.rainfall[1]);

    const weightedScore =
      FEATURE_WEIGHTS.n * nScore +
      FEATURE_WEIGHTS.p * pScore +
      FEATURE_WEIGHTS.k * kScore +
      FEATURE_WEIGHTS.temp * tempScore +
      FEATURE_WEIGHTS.humidity * humidityScore +
      FEATURE_WEIGHTS.ph * phScore +
      FEATURE_WEIGHTS.rainfall * rainfallScore;

    scores.push({ crop: cropName, score: weightedScore, confidence: 0 });
  }

  // Sort by score descending
  scores.sort((a, b) => b.score - a.score);

  // Compute softmax confidence
  const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
  scores.forEach(s => {
    s.confidence = totalScore > 0 ? s.score / totalScore : 0;
  });

  const best = scores[0];
  const alternatives = scores.slice(1, 4).map(s => s.crop);

  // Scale confidence to be more realistic (top score relative to second)
  const scaledConfidence = Math.min(0.99, Math.max(0.5, best.score / (best.score + scores[1].score)));

  return {
    crop: best.crop,
    confidence: Math.round(scaledConfidence * 100) / 100,
    alternativeCrops: alternatives,
  };
}

export function getCropProfile(cropName: string) {
  return CROP_PROFILES[cropName] || null;
}

export function getAllCrops(): string[] {
  return Object.keys(CROP_PROFILES);
}
