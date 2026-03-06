"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronDown, Plus, Trash2, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppSelector, useAppDispatch } from "@/hooks";
import { fetchMenus } from "@/features/menus/menusSlice";
import { buildMenuTree } from "@/utils/menuUtils";
import { countAllChildren } from "@/utils/menuTreeUtils";
import { Menu as MenuType } from "@/types/menu";

interface TreeNodeProps {
  item: MenuType;
  level: number;
  onAddMenu: (parentId: string) => void;
  onDeleteMenu: (menuId: number, menuName: string, hasChildren: boolean, childrenCount: number) => void;
  onEditMenu: (menu: MenuType) => void;
  onToggleExpand: (menuId: number) => void;
  expandedNodes: Set<number>;
}

function TreeNode({ item, level, onAddMenu, onDeleteMenu, onEditMenu, onToggleExpand, expandedNodes }: TreeNodeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expandedNodes.has(item.id);

  return (
    <div className="select-none">
      <div
        className={cn(
          "flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-all duration-200",
          "hover:bg-gray-100 group",
          isHovered && "bg-gray-50"
        )}
        style={{ paddingLeft: `${level * 24 + 12}px` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => hasChildren && onToggleExpand(item.id)}
      >
        {/* Chevron untuk expand/collapse */}
        {hasChildren && (
          <div
            className={cn(
              "transition-transform duration-200",
              isExpanded ? "rotate-90" : ""
            )}
          >
            <ChevronRight className="h-4 w-4 text-gray-500" />
          </div>
        )}

        {/* Spacer untuk item tanpa children */}
        {!hasChildren && <div className="w-4" />}

        {/* Menu name */}
        <span className="flex-1 text-gray-800 font-medium flex items-center gap-2">
          {item.name}
          {/* Action buttons muncul saat hover */}
          {isHovered && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {/* Tombol Edit */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditMenu(item);
                }}
                className="bg-green-500 text-white rounded-full p-1 hover:bg-green-600"
                title="Edit menu"
              >
                <Edit className="h-3 w-3" />
              </button>
              
              {/* Tombol Plus */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddMenu(item.id.toString());
                }}
                className="bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600"
                title="Add child menu"
              >
                <Plus className="h-3 w-3" />
              </button>
              
              {/* Tombol Delete */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const childrenCount = countAllChildren(item);
                  onDeleteMenu(item.id, item.name, Boolean(hasChildren), childrenCount);
                }}
                className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                title="Delete menu"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          )}
        </span>
      </div>

      {/* Children nodes */}
      {hasChildren && isExpanded && (
        <div className="ml-2">
          {item.children!.map((child) => (
            <TreeNode
              key={child.id}
              item={child}
              level={level + 1}
              onAddMenu={onAddMenu}
              onDeleteMenu={onDeleteMenu}
              onEditMenu={onEditMenu}
              onToggleExpand={onToggleExpand}
              expandedNodes={expandedNodes}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface MenuTreeProps {
  onAddMenu?: (parentId: string) => void;
  onDeleteMenu?: (menuId: number, menuName: string, hasChildren: boolean, childrenCount: number) => void;
  onEditMenu?: (menu: MenuType) => void;
}

export function MenuTree({ onAddMenu, onDeleteMenu, onEditMenu }: MenuTreeProps) {
  const dispatch = useAppDispatch();
  const { data: menus, loading, error } = useAppSelector((state: any) => state.menus);
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());

  // Fetch menus on component mount
  useEffect(() => {
    dispatch(fetchMenus());
  }, [dispatch]);

  const handleAddMenu = (parentId: string) => {
    console.log("Add menu to parent:", parentId);
    // Keep parent expanded when adding child
    setExpandedNodes(prev => new Set([...prev, parseInt(parentId)]));
    onAddMenu?.(parentId);
  };

  const handleDeleteMenu = (menuId: number, menuName: string, hasChildren: boolean, childrenCount: number) => {
    console.log("Delete menu:", menuId, menuName, hasChildren, childrenCount);
    onDeleteMenu?.(menuId, menuName, hasChildren, childrenCount);
  };

  const handleEditMenu = (menu: MenuType) => {
    console.log("Edit menu:", menu);
    onEditMenu?.(menu);
  };

  const handleToggleExpand = (menuId: number) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(menuId)) {
        newSet.delete(menuId);
      } else {
        newSet.add(menuId);
      }
      return newSet;
    });
  };

  // Build tree structure from flat data with defensive programming
  const menuTree = React.useMemo(() => {
    if (!Array.isArray(menus)) {
      console.warn("MenuTree: menus is not an array");
      return [];
    }
    return buildMenuTree(menus);
  }, [menus]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading menus...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (menuTree.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">No menus found</div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {menuTree.map((item) => (
        <TreeNode
          key={item.id}
          item={item}
          level={0}
          onAddMenu={handleAddMenu}
          onDeleteMenu={handleDeleteMenu}
          onEditMenu={handleEditMenu}
          onToggleExpand={handleToggleExpand}
          expandedNodes={expandedNodes}
        />
      ))}
    </div>
  );
}
