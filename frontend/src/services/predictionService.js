import apiClient from "../api/client";

export async function predictRisk(payload) {
  const response = await apiClient.post("/predict", payload);
  return response.data?.prediction;
}

export async function getFeatureImportance() {
  const response = await apiClient.get("/feature-importance");
  return response.data?.features || [];
}
