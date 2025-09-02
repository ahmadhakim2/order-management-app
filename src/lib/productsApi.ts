import axios from "axios";
import { Product } from "@/types/order";

const API_BASE_URL = "https://recruitment-spe.vercel.app/api/v1";
const AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFobWFkaGFraW02Nzk4QGdtYWlsLmNvbSIsInR5cGUiOiJmcm9udGVuZCIsImlhdCI6MTc1NjgxNzg0NywiZXhwIjoxNzU2ODI2ODQ3fQ.PoLveA_QzM_OUkbXGVHxyYx6nO_9Q2TQTdIjJ3BJhp4";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${AUTH_TOKEN}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const productsApi = {
  getProducts: async (): Promise<Product[]> => {
    try {
      const response = await api.get("/products");
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  getProduct: async (id: string): Promise<Product> => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  },
};

export default api;
