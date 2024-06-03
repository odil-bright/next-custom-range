import { apiGet } from "@/api/api";
import { ApiOperations } from "@/context/ApiOperationsContext";
import { endpoints } from "@/models/api";

export const apiOperations: ApiOperations = {
  getPriceRange: async () => {
    const result = await apiGet(endpoints.range);
    return result;
  },
  getPriceSteps: async () => {
    const result = await apiGet(endpoints.steps);
    return result;
  },
};

export async function getPriceRange() {
  const result = await apiGet(endpoints.range);
  return result;
}

export async function getPriceSteps() {
  const result = await apiGet(endpoints.steps);
  return result;
}
