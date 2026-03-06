"use client";

import { Layout } from "@/components/layouts/Layout";
import { Menu } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MenuTree, MenuForm, MenuDeleteDialog } from "@/components/menus";
import { useAppSelector } from "@/hooks";
import { useState } from "react";
import { Menu as MenuType } from "@/types/menu";

export default function MenusPage() {
  const { data: menus } = useAppSelector((state: any) => state.menus);
  const [selectedMenuId, setSelectedMenuId] = useState<string>("");
  const [isMenuFormOpen, setIsMenuFormOpen] = useState(false);
  const [parentMenuId, setParentMenuId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState<{ id: number; name: string; hasChildren: boolean; childrenCount: number } | null>(null);
  const [menuToEdit, setMenuToEdit] = useState<MenuType | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");

  // Get root level menus (parentId === null)
  const rootMenus = menus.filter((menu: MenuType) => menu.parentId === null);

  const handleAddMenu = (parentId: string) => {
    console.log("Adding new menu to parent:", parentId);
    setParentMenuId(parentId);
    setFormMode("create");
    setMenuToEdit(null);
    setIsMenuFormOpen(true);
  };

  const handleEditMenu = (menu: MenuType) => {
    console.log("Editing menu:", menu);
    setMenuToEdit(menu);
    setFormMode("edit");
    setParentMenuId(null);
    setIsMenuFormOpen(true);
  };

  const handleDeleteMenu = (menuId: number, menuName: string, hasChildren: boolean, childrenCount: number) => {
    console.log("Deleting menu:", menuId, menuName, hasChildren, childrenCount);
    setMenuToDelete({ id: menuId, name: menuName, hasChildren, childrenCount });
    setIsDeleteDialogOpen(true);
  };

  const handleMenuSelect = (menuId: string) => {
    setSelectedMenuId(menuId);
    console.log("Selected menu:", menuId);
    // TODO: Implement menu selection logic
  };

  const handleAddRootMenu = () => {
    setParentMenuId(null);
    setFormMode("create");
    setMenuToEdit(null);
    setIsMenuFormOpen(true);
  };

  const handleMenuFormClose = () => {
    setIsMenuFormOpen(false);
    setParentMenuId(null);
    setMenuToEdit(null);
    setFormMode("create");
  };

  const handleMenuFormSuccess = () => {
    console.log("Menu created successfully");
    // Menu tree will automatically update due to Redux state change
  };

  const handleDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false);
    setMenuToDelete(null);
  };

  const handleDeleteSuccess = () => {
    console.log("Menu deleted successfully");
    // Menu tree will automatically update due to Redux state change
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full">
            <Menu className="h-6 w-6" />
          </div>
          <h1 className="text-4xl font-bold">Menus</h1>
        </div>

        <div className="w-full max-w-md">
          <Label className="mb-2">Menu</Label>
          <Select value={selectedMenuId} onValueChange={handleMenuSelect}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih menu" />
            </SelectTrigger>
            <SelectContent>
              {rootMenus.map((menu: MenuType) => (
                <SelectItem key={menu.id} value={menu.id.toString()}>
                  {menu.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-9 py-4">
            Expand All
          </Button>
          <Button
            variant="outline"
            className="bg-white text-black border-gray-300 hover:bg-gray-50 rounded-full px-9 py-4"
          >
            Collapse All
          </Button>
          <Button
            onClick={handleAddRootMenu}
            className="bg-blue-600 text-white hover:bg-blue-700 rounded-full px-9 py-4"
          >
            Add Root Menu
          </Button>
        </div>

        {/* Menu Tree - now using Redux data */}
        <div className="w-full">
          <MenuTree 
            onAddMenu={handleAddMenu} 
            onDeleteMenu={handleDeleteMenu}
            onEditMenu={handleEditMenu}
          />
        </div>

        {/* Menu Form Dialog */}
        <MenuForm
          isOpen={isMenuFormOpen}
          onClose={handleMenuFormClose}
          parentId={parentMenuId}
          onSuccess={handleMenuFormSuccess}
          menu={menuToEdit || undefined}
          mode={formMode}
        />

        {/* Delete Confirmation Dialog */}
        {menuToDelete && (
          <MenuDeleteDialog
            isOpen={isDeleteDialogOpen}
            onClose={handleDeleteDialogClose}
            menuId={menuToDelete.id}
            menuName={menuToDelete.name}
            hasChildren={menuToDelete.hasChildren}
            childrenCount={menuToDelete.childrenCount}
            onSuccess={handleDeleteSuccess}
          />
        )}
      </div>
    </Layout>
  );
}
