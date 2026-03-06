import { Menu } from "@/types/menu";

// Transform menu array to tree structure (handle both flat and tree input)
export function buildMenuTree(menus: Menu[]): Menu[] {
  console.log("buildMenuTree input:", menus);
  
  // Defensive programming - ensure menus is an array
  if (!Array.isArray(menus)) {
    console.warn("buildMenuTree: menus is not an array, returning empty array");
    return [];
  }

  if (menus.length === 0) {
    console.log("buildMenuTree: empty array, returning empty");
    return [];
  }

  // Check if data is already in tree format (has children property)
  const hasTreeStructure = menus.some(menu => 
    menu.children && Array.isArray(menu.children) && menu.children.length > 0
  );

  if (hasTreeStructure) {
    console.log("Data is already in tree format, returning as-is");
    // Data is already in tree format, just sort by order
    const sortMenus = (menus: Menu[]): Menu[] => {
      // Create a copy first to avoid read-only array error
      const menusCopy = [...menus];
      return menusCopy
        .sort((a, b) => a.order - b.order)
        .map((menu) => ({
          ...menu,
          children: menu.children && menu.children.length > 0 
            ? sortMenus(menu.children) 
            : [],
        }));
    };
    
    const result = sortMenus(menus);
    console.log("buildMenuTree result (tree format):", result);
    return result;
  }

  // Data is flat, build tree structure
  console.log("Data is flat, building tree structure");
  const menuMap = new Map<number, Menu>();
  const rootMenus: Menu[] = [];

  // Create a map of all menus
  menus.forEach((menu) => {
    console.log("Processing menu:", menu);
    menuMap.set(menu.id, { ...menu, children: [] });
  });

  // Build tree structure
  menus.forEach((menu) => {
    const menuWithChildren = menuMap.get(menu.id)!;
    
    if (menu.parentId === null) {
      // This is a root menu
      console.log("Found root menu:", menu.name);
      rootMenus.push(menuWithChildren);
    } else {
      // This is a child menu
      console.log("Processing child menu:", menu.name, "parentId:", menu.parentId);
      const parent = menuMap.get(menu.parentId);
      if (parent) {
        parent.children = parent.children || [];
        parent.children.push(menuWithChildren);
        console.log("Added child to parent:", menu.name, "→", parent.name);
      } else {
        console.warn("Parent not found for menu:", menu.name, "parentId:", menu.parentId);
      }
    }
  });

  console.log("Before sorting - rootMenus:", rootMenus);

  // Sort menus by order
  const sortMenus = (menus: Menu[]): Menu[] => {
    // Create a copy first to avoid read-only array error
    const menusCopy = [...menus];
    return menusCopy
      .sort((a, b) => a.order - b.order)
      .map((menu) => ({
        ...menu,
        children: menu.children && menu.children.length > 0 
          ? sortMenus(menu.children) 
          : [],
      }));
  };

  const result = sortMenus(rootMenus);
  console.log("buildMenuTree result (flat format):", result);
  return result;
}

// Find menu by ID in tree structure
export function findMenuById(menus: Menu[], id: number): Menu | null {
  for (const menu of menus) {
    if (menu.id === id) {
      return menu;
    }
    if (menu.children && menu.children.length > 0) {
      const found = findMenuById(menu.children, id);
      if (found) return found;
    }
  }
  return null;
}

// Get all parent IDs for a menu
export function getParentPath(menus: Menu[], menuId: number): number[] {
  const path: number[] = [];
  
  const findPath = (menuList: Menu[], targetId: number, currentPath: number[] = []): number[] | null => {
    for (const menu of menuList) {
      if (menu.id === targetId) {
        return [...currentPath, menu.id];
      }
      if (menu.children && menu.children.length > 0) {
        const found = findPath(menu.children, targetId, [...currentPath, menu.id]);
        if (found) return found;
      }
    }
    return null;
  };
  
  const fullPath = findPath(menus, menuId);
  return fullPath ? fullPath.slice(0, -1) : []; // Exclude the menu itself
}

// Check if menu has children
export function hasChildren(menu: Menu): boolean {
  return !!(menu.children && menu.children.length > 0);
}

// Get max depth of menu tree
export function getMaxDepth(menus: Menu[], currentDepth = 0): number {
  let maxDepth = currentDepth;
  
  for (const menu of menus) {
    if (menu.children && menu.children.length > 0) {
      const childDepth = getMaxDepth(menu.children, currentDepth + 1);
      maxDepth = Math.max(maxDepth, childDepth);
    }
  }
  
  return maxDepth;
}
