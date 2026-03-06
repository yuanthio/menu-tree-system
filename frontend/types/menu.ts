export interface Menu {
  id: number;
  name: string;
  url?: string;
  icon?: string;
  parentId: number | null;
  order: number;
  createdAt: string;
  updatedAt: string;
  children?: Menu[];
}

export interface CreateMenuRequest {
  name: string;
  parentId?: number | null;
}

export interface UpdateMenuRequest {
  name?: string;
  url?: string;
  icon?: string;
  parentId?: number | null;
  order?: number;
}

export interface MoveMenuRequest {
  newParentId?: number | null;
  newOrder?: number;
}

export interface ReorderMenuRequest {
  menuIds: number[];
}