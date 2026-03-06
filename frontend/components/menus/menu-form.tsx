"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAppSelector, useAppDispatch } from "@/hooks";
import { createMenu, updateMenu, fetchMenus } from "@/features/menus/menusSlice";
import { toast } from "sonner";
import { Menu as MenuType } from "@/types/menu";

interface MenuFormProps {
  isOpen: boolean;
  onClose: () => void;
  parentId?: string | null;
  onSuccess?: () => void;
  menu?: MenuType; // For edit mode
  mode?: "create" | "edit";
}

interface FormData {
  name: string;
}

interface FormErrors {
  name?: string;
}

export function MenuForm({ 
  isOpen, 
  onClose, 
  parentId = null, 
  onSuccess, 
  menu, 
  mode = "create" 
}: MenuFormProps) {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state: any) => state.menus);
  
  const [formData, setFormData] = useState<FormData>({
    name: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Reset form when dialog opens/closes or when menu data changes
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && menu) {
        // Pre-fill form with existing menu data
        setFormData({
          name: menu.name,
        });
      } else {
        // Reset form for create mode
        setFormData({
          name: "",
        });
      }
      setErrors({});
    }
  }, [isOpen, mode, menu]);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Menu name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev: FormData) => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error for this field
    if (errors[field as keyof FormErrors]) {
      setErrors((prev: FormErrors) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (mode === "edit" && menu) {
        // Update existing menu
        await dispatch(updateMenu({
          id: menu.id,
          data: {
            name: formData.name,
          }
        })).unwrap();

        // Show success notification
        toast.success(`Menu "${formData.name}" updated successfully!`);
      } else {
        // Create new menu
        await dispatch(createMenu({
          name: formData.name,
          parentId: parentId ? parseInt(parentId) : null,
        })).unwrap();

        // Show success notification
        const menuType = parentId === null ? "Root menu" : "Child menu";
        toast.success(`${menuType} "${formData.name}" created successfully!`);
        
        // Refresh to replace temporary menu with real data
        dispatch(fetchMenus());
      }

      // Close dialog and call success callback
      onClose();
      onSuccess?.();
      
    } catch (error) {
      console.error(`Failed to ${mode} menu:`, error);
      toast.error(`Failed to ${mode} menu. Please try again.`);
    }
  };

  // Determine dialog title and button text
  const isRootMenu = parentId === null;
  const dialogTitle = mode === "edit" ? "Edit Menu" : (isRootMenu ? "Add Root Menu" : "Add Child Menu");
  const buttonText = mode === "edit" ? (loading ? "Updating..." : "Update Menu") : (loading ? "Creating..." : "Create Menu");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {dialogTitle}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Menu Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Menu Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter menu name"
              className={errors.name ? "border-red-500" : ""}
              autoFocus
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {buttonText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
