export class Menu {
  id: number;
  name: string;
  url: string | null;
  icon: string | null;
  parentId: number | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;

  children?: Menu[];
  parent?: Menu | null;
}