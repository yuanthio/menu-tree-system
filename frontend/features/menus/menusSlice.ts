import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Menu, CreateMenuRequest, UpdateMenuRequest, MoveMenuRequest, ReorderMenuRequest } from "@/types/menu";
import { menusApi } from "./menusApi";

// Async thunks
export const fetchMenus = createAsyncThunk(
  "menus/fetchMenus",
  async (_, { rejectWithValue }) => {
    try {
      const menus = await menusApi.getMenus();
      console.log("Redux fetchMenus success:", menus);
      return menus;
    } catch (error: any) {
      console.error("Redux fetchMenus error:", error);
      // Extract meaningful error message
      const errorMessage = error.response?.data?.message || 
                        error.message || 
                        "Failed to fetch menus";
      return rejectWithValue(errorMessage);
    }
  }
);

export const createMenu = createAsyncThunk(
  "menus/createMenu",
  async (data: CreateMenuRequest, { rejectWithValue }) => {
    try {
      const response = await menusApi.createMenu(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create menu");
    }
  }
);

export const updateMenu = createAsyncThunk(
  "menus/updateMenu",
  async ({ id, data }: { id: number; data: UpdateMenuRequest }, { rejectWithValue }) => {
    try {
      const response = await menusApi.updateMenu(id, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update menu");
    }
  }
);

export const deleteMenu = createAsyncThunk(
  "menus/deleteMenu",
  async (id: number, { rejectWithValue }) => {
    try {
      await menusApi.deleteMenu(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete menu");
    }
  }
);

export const moveMenu = createAsyncThunk(
  "menus/moveMenu",
  async ({ id, data }: { id: number; data: MoveMenuRequest }, { rejectWithValue }) => {
    try {
      const response = await menusApi.moveMenu(id, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to move menu");
    }
  }
);

export const reorderMenus = createAsyncThunk(
  "menus/reorderMenus",
  async (data: ReorderMenuRequest, { rejectWithValue }) => {
    try {
      const response = await menusApi.reorderMenus(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to reorder menus");
    }
  }
);

// State interface
interface MenusState {
  data: Menu[];
  loading: boolean;
  error: string | null;
  selectedMenu: Menu | null;
}

// Initial state
const initialState: MenusState = {
  data: [],
  loading: false,
  error: null,
  selectedMenu: null,
};

// Slice
const menusSlice = createSlice({
  name: "menus",
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Set selected menu
    setSelectedMenu: (state, action: PayloadAction<Menu | null>) => {
      state.selectedMenu = action.payload;
    },
    
    // Reset state
    resetMenusState: (state) => {
      state.data = [];
      state.loading = false;
      state.error = null;
      state.selectedMenu = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch menus
    builder
      .addCase(fetchMenus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenus.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchMenus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create menu
    builder
      .addCase(createMenu.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        // Optimistic update: add temporary menu immediately
        const tempMenu: Menu = {
          id: Date.now(), // Temporary ID
          name: action.meta.arg.name,
          parentId: action.meta.arg.parentId || null,
          order: 999, // Temporary order
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        state.data.push(tempMenu);
      })
      .addCase(createMenu.fulfilled, (state) => {
        state.loading = false;
        // Temporary menu will be replaced by real data from fetchMenus
        // This ensures data consistency with backend
      })
      .addCase(createMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // Remove temporary menu on error
        state.data = state.data.filter(menu => menu.id > 1000000000000); // Remove temp IDs
      });

    // Update menu
    builder
      .addCase(updateMenu.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        // Optimistic update: update menu immediately
        const { id, data } = action.meta.arg;
        const updateMenuInTree = (menus: Menu[]): Menu[] => {
          return menus.map((menu) => {
            if (menu.id === id) {
              return { ...menu, ...data };
            }
            if (menu.children) {
              return {
                ...menu,
                children: updateMenuInTree(menu.children),
              };
            }
            return menu;
          });
        };
        state.data = updateMenuInTree(state.data);
      })
      .addCase(updateMenu.fulfilled, (state) => {
        state.loading = false;
        // Menu already updated by optimistic update
        // Data will be refreshed to ensure consistency
      })
      .addCase(updateMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // Revert optimistic update by refetching data
        // In a real app, you might want to implement proper revert logic
      });

    // Delete menu
    builder
      .addCase(deleteMenu.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        // Optimistic update: remove menu and all its children immediately
        const removeMenuAndChildren = (menus: Menu[]): Menu[] => {
          return menus.filter((menu) => {
            // Check if this menu or any of its descendants should be removed
            if (menu.id === action.meta.arg) {
              return false; // Remove this menu
            }
            if (menu.children) {
              menu.children = removeMenuAndChildren(menu.children);
            }
            return true;
          });
        };
        state.data = removeMenuAndChildren(state.data);
      })
      .addCase(deleteMenu.fulfilled, (state) => {
        state.loading = false;
        // Menu and children already removed by optimistic update
        // Data will be refreshed to ensure consistency
      })
      .addCase(deleteMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // Revert optimistic update by refetching data
        // In a real app, you might want to implement proper revert logic
      });

    // Move menu
    builder
      .addCase(moveMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(moveMenu.fulfilled, (state) => {
        state.loading = false;
        // Will refetch to get updated tree structure
      })
      .addCase(moveMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Reorder menus
    builder
      .addCase(reorderMenus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reorderMenus.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(reorderMenus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setSelectedMenu, resetMenusState } = menusSlice.actions;
export default menusSlice.reducer;