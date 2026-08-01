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
    name: "Bacterial Canker",
    slug: "bacterial-canker",
    symptoms: ["Water-soaked lesions", "Cankers along leaf veins and stems"],
    causes: [
      "Bacterial infection through wounds",
      "Rain splash and contaminated tools",
    ],
    treatment: "Remove infected parts and disinfect tools after use.",
    prevention: "Use clean pruning tools and avoid unnecessary wounds.",
    description: "A bacterial infection that damages leaves, stems, and fruit.",
  },
  {
    name: "Cutting Weevil",
    slug: "cutting-weevil",
    symptoms: ["Irregular cuts on leaves", "Chewed margins and holes"],
    causes: ["Adult weevil feeding", "Poor orchard sanitation"],
    treatment: "Use insect control measures and remove damaged foliage.",
    prevention: "Keep the orchard clean and monitor new flushes closely.",
    description: "An insect pest that cuts and damages mango leaves.",
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
    name: "Powdery Mildew",
    slug: "powdery-mildew",
    symptoms: ["White powdery coating", "Stunted leaf growth and curling"],
    causes: ["Fungal spores in cool dry nights", "Crowded canopy"],
    treatment: "Apply sulfur or fungicide sprays at early infection stage.",
    prevention: "Prune for airflow and avoid excessive shade.",
    description: "A fungal disease characterized by white powdery growth.",
  },
  {
    name: "Sooty Mold",
    slug: "sooty-mold",
    symptoms: ["Black soot-like coating on leaves", "Reduced photosynthesis"],
    causes: ["Honeydew from sap-sucking insects", "High humidity"],
    treatment: "Control insect infestation and wash leaves when practical.",
    prevention: "Manage aphids and scale insects early.",
    description: "A fungal growth that develops on honeydew deposits.",
  },
];

export function normalizeDiseaseName(name) {
  return name
    .replace(/[_\s]+/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}
