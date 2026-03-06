"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useAppSelector, useAppDispatch } from "@/hooks";
import { deleteMenu, fetchMenus } from "@/features/menus/menusSlice";
import { toast } from "sonner";

interface MenuDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  menuId: number;
  menuName: string;
  hasChildren?: boolean;
  childrenCount?: number;
  onSuccess?: () => void;
}

export function MenuDeleteDialog({ 
  isOpen, 
  onClose, 
  menuId, 
  menuName, 
  hasChildren = false,
  childrenCount = 0,
  onSuccess 
}: MenuDeleteDialogProps) {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state: any) => state.menus);

  const handleDelete = async () => {
    try {
      await dispatch(deleteMenu(menuId)).unwrap();

      // Show success notification
      const deleteMessage = hasChildren 
        ? `Menu "${menuName}" and ${childrenCount} child(ren) deleted successfully!`
        : `Menu "${menuName}" deleted successfully!`;
      toast.success(deleteMessage);
      
      // Close dialog and call success callback
      onClose();
      onSuccess?.();
      
    } catch (error) {
      console.error("Failed to delete menu:", error);
      toast.error("Failed to delete menu. Please try again.");
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Menu</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{menuName}"? This action cannot be undone.
            {hasChildren && (
              <span className="text-red-600 font-medium block mt-2">
                ⚠️ This will also delete {childrenCount} child menu(s) and all their descendants.
              </span>
            )}
            {loading && " Deleting menu..."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" disabled={loading}>
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
