import Disease from "../models/Disease.js";
import { diseaseCatalog } from "../constants/diseases.js";

// Keeps the Disease collection in sync with diseaseCatalog on every server
// start: upserts current entries and removes any that are no longer in the
// catalog (e.g. after a model retrain changes the class taxonomy). Seeding
// only when the collection was empty left production with a stale 8-class
// catalog after the 6-class retrain, since nothing ever removed the old
// entries or added the new ones.
export async function syncDiseases() {
  const catalogNames = diseaseCatalog.map((disease) => disease.name);

  await Promise.all(
    diseaseCatalog.map((disease) =>
      Disease.updateOne(
        { name: disease.name },
        {
          $set: {
            slug: disease.slug,
            description: disease.description,
            symptoms: disease.symptoms,
            causes: disease.causes,
            treatment: disease.treatment,
            prevention: disease.prevention,
            isHealthy: disease.name === "Healthy",
          },
        },
        { upsert: true },
      ),
    ),
  );

  await Disease.deleteMany({ name: { $nin: catalogNames } });
}
