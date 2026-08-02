export const diseaseCatalog = [
  {
    name: "Healthy",
    slug: "healthy",
    symptoms: ["Vibrant green leaves", "No spots, curling, or necrosis"],
    causes: ["Healthy plant growth", "Proper nutrient balance"],
    treatment: "Continue regular care, watering, pruning, and monitoring.",
    prevention: "Maintain soil nutrition, irrigation, and early inspections.",
    description: "The mango leaf is free from visible disease symptoms.",
  },
  {
    name: "Anthracnose",
    slug: "anthracnose",
    symptoms: ["Dark irregular leaf spots", "Leaf blight and premature drop"],
    causes: ["Fungal infection in humid conditions", "Poor air circulation"],
    treatment: "Remove infected tissue and apply a copper-based fungicide.",
    prevention:
      "Prune for airflow and avoid overhead irrigation during wet weather.",
    description: "A fungal disease that causes black lesions and leaf damage.",
  },
  {
    name: "Die Back",
    slug: "die-back",
    symptoms: ["Drying from tip to base", "Twigs and shoots withered"],
    causes: ["Fungal attack", "Water stress and nutrient imbalance"],
    treatment:
      "Prune dead wood and improve nutrition with proper fungicide support.",
    prevention: "Ensure balanced fertilization and sanitation pruning.",
    description: "A condition where branches and shoots progressively dry out.",
  },
  {
    name: "Gall Midge",
    slug: "gall-midge",
    symptoms: ["Swollen leaf tissues", "Curled and distorted young leaves"],
    causes: ["Insect larvae feeding inside tissues", "Warm humid conditions"],
    treatment: "Remove affected leaves and apply recommended insect control.",
    prevention: "Inspect young flushes regularly and manage orchard hygiene.",
    description: "An insect pest that induces galls and leaf distortion.",
  },
  {
    name: "Leaf Webber",
    slug: "leaf-webber",
    symptoms: [
      "Leaves webbed together with silk strands",
      "Skeletonized or chewed leaf tissue under the webbing",
    ],
    causes: [
      "Larvae of the mango leaf webber moth feeding and spinning webs",
      "Dense canopy sheltering larvae",
    ],
    treatment:
      "Prune and destroy webbed leaves, then apply an appropriate contact or systemic insecticide.",
    prevention:
      "Prune for canopy airflow, remove webbed nests early, and monitor new flushes during peak moth activity.",
    description: "An insect pest that webs leaves together and skeletonizes them.",
  },
  {
    name: "Leaf Blight",
    slug: "leaf-blight",
    symptoms: [
      "Large irregular brown or tan necrotic patches",
      "Leaf margins drying and curling",
    ],
    causes: [
      "Fungal or bacterial pathogens favored by prolonged leaf wetness",
      "Poor drainage and overcrowded planting",
    ],
    treatment:
      "Remove and destroy blighted leaves, and apply a copper-based or systemic fungicide.",
    prevention:
      "Improve air circulation, avoid overhead irrigation, and remove fallen infected leaves from the orchard floor.",
    description: "A disease causing large necrotic patches across the leaf blade.",
  },
];

export function normalizeDiseaseName(name) {
  return name
    .replace(/[_\s]+/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}
