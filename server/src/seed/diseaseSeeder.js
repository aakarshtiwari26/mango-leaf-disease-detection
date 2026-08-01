import Disease from "../models/Disease.js";
import { diseaseCatalog } from "../constants/diseases.js";

export async function seedDiseasesIfNeeded() {
  const count = await Disease.countDocuments();

  if (count > 0) {
    return;
  }

  await Disease.insertMany(
    diseaseCatalog.map((disease) => ({
      name: disease.name,
      slug: disease.slug,
      description: disease.description,
      symptoms: disease.symptoms,
      causes: disease.causes,
      treatment: disease.treatment,
      prevention: disease.prevention,
      isHealthy: disease.name === "Healthy",
    })),
  );
}
