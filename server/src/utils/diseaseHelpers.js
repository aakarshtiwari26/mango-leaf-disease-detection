import { diseaseCatalog } from "../constants/diseases.js";

export function findDiseaseMetadata(diseaseName) {
  return diseaseCatalog.find(
    (disease) => disease.name.toLowerCase() === diseaseName.toLowerCase(),
  );
}

export function toSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
