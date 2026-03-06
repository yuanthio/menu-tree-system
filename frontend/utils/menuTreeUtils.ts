import { Menu } from "@/types/menu";

export function countAllChildren(menu: Menu): number {
  if (!menu.children || menu.children.length === 0) {
    return 0;
  }
  
  let count = menu.children.length;
  for (const child of menu.children) {
    count += countAllChildren(child);
  }
  
  return count;
}

export function findMenuById(menus: Menu[], id: number): Menu | null {
  for (const menu of menus) {
    if (menu.id === id) {
      return menu;
    }
    if (menu.children) {
      const found = findMenuById(menu.children, id);
      if (found) {
        return found;
      }
    }
  }
  return null;
}
