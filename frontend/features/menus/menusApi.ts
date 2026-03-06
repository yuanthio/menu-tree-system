import { api } from "@/services/api";
import { Menu, CreateMenuRequest, UpdateMenuRequest, MoveMenuRequest, ReorderMenuRequest } from "@/types/menu";

// API response type wrapper
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const menusApi = {
  // Get all menus with tree structure
  getMenus: async (): Promise<Menu[]> => {
    try {
      const response = await api.get("/menus");
      console.log("API Response raw:", response);
      console.log("API Response data:", response.data);
      
      // Backend returns wrapped response: {success: true, message: "...", data: Menu[]}
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        console.log("Extracted menus:", response.data.data);
        return response.data.data;
      } else if (Array.isArray(response.data)) {
        // Fallback: if response is already an array
        console.log("Response is already array:", response.data);
        return response.data;
      } else {
        console.error("Unexpected response format:", response.data);
        throw new Error("Invalid response format from API");
      }
    } catch (error: any) {
      console.error("API Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },

  // Get menu by ID
  getMenuById: async (id: number): Promise<Menu> => {
    try {
      const response = await api.get(`/menus/${id}`);
      console.log("API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  // Create new menu
  createMenu: async (data: CreateMenuRequest): Promise<Menu> => {
    const response = await api.post("/menus", data);
    return response.data;
  },

  // Update menu
  updateMenu: async (id: number, data: UpdateMenuRequest): Promise<Menu> => {
    const response = await api.patch(`/menus/${id}`, data);
    return response.data;
  },

  // Delete menu
  deleteMenu: async (id: number): Promise<void> => {
    await api.delete(`/menus/${id}`);
  },

  // Move menu to different parent or position
  moveMenu: async (id: number, data: MoveMenuRequest): Promise<Menu> => {
    const response = await api.patch(`/menus/${id}/move`, data);
    return response.data;
  },

  // Reorder menus
  reorderMenus: async (data: ReorderMenuRequest): Promise<Menu[]> => {
    const response = await api.patch("/menus/reorder", data);
    return response.data;
  },
};