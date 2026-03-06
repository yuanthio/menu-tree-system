import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { MenuRepository } from '../repositories/menu.repository';
import { Menu } from '../entities/menu.entity';
import { CreateMenuDto } from '../dto/create-menu.dto';
import { UpdateMenuDto } from '../dto/update-menu.dto';
import { MoveMenuDto } from '../dto/move-menu.dto';

@Injectable()
export class MenuService {
  constructor(private readonly menuRepository: MenuRepository) {}

  async findAll(): Promise<Menu[]> {
    const menus = await this.menuRepository.findAll();
    return this.buildTreeStructure(menus);
  }

  async findById(id: number): Promise<Menu> {
    const menu = await this.menuRepository.findById(id);
    if (!menu) {
      throw new NotFoundException(`Menu with id ${id} not found`);
    }
    return menu;
  }

  async create(createMenuDto: CreateMenuDto): Promise<Menu> {
    // Validasi parent menu jika ada
    if (createMenuDto.parentId) {
      const parentExists = await this.menuRepository.findById(createMenuDto.parentId);
      if (!parentExists) {
        throw new BadRequestException(`Parent menu with id ${createMenuDto.parentId} not found`);
      }
    }

    // Auto-generate order (selalu +1 dari max order untuk parent yang sama)
    const maxOrder = await this.menuRepository.findMaxOrderByParentId(createMenuDto.parentId || null);
    const order = maxOrder + 1;

    return this.menuRepository.create({
      ...createMenuDto,
      order,
    });
  }

  async update(id: number, updateMenuDto: UpdateMenuDto): Promise<Menu> {
    const existingMenu = await this.findById(id);

    // Jika parentId berubah, validasi parent baru
    if (updateMenuDto.parentId !== undefined) {
      if (updateMenuDto.parentId !== existingMenu.parentId) {
        if (updateMenuDto.parentId) {
          const parentExists = await this.menuRepository.findById(updateMenuDto.parentId);
          if (!parentExists) {
            throw new BadRequestException(`Parent menu with id ${updateMenuDto.parentId} not found`);
          }
          
          // Cegah circular reference
          if (await this.wouldCreateCircularReference(id, updateMenuDto.parentId)) {
            throw new BadRequestException('Cannot move menu to its own descendant');
          }
        }
      }
    }

    return this.menuRepository.update(id, updateMenuDto);
  }

  async delete(id: number): Promise<Menu> {
    const existingMenu = await this.findById(id);
    
    // Cascade delete: hapus semua children dan descendants
    await this.deleteMenuAndChildren(id);
    
    return existingMenu;
  }

  private async deleteMenuAndChildren(menuId: number): Promise<void> {
    // Cari semua children langsung
    const children = await this.menuRepository.findByParentId(menuId);
    
    // Recursive delete untuk setiap child
    for (const child of children) {
      await this.deleteMenuAndChildren(child.id);
    }
    
    // Hapus menu ini setelah semua children dihapus
    await this.menuRepository.delete(menuId);
  }

  async moveMenu(id: number, moveMenuDto: MoveMenuDto): Promise<Menu> {
    const existingMenu = await this.findById(id);

    // Validasi parent baru jika ditentukan
    if (moveMenuDto.newParentId !== undefined) {
      if (moveMenuDto.newParentId) {
        const parentExists = await this.menuRepository.findById(moveMenuDto.newParentId);
        if (!parentExists) {
          throw new BadRequestException(`Parent menu with id ${moveMenuDto.newParentId} not found`);
        }
        
        // Cegah circular reference
        if (await this.wouldCreateCircularReference(id, moveMenuDto.newParentId)) {
          throw new BadRequestException('Cannot move menu to its own descendant');
        }
      }
    }

    // Handle reorder logic
    await this.reorderSingleMenu(
      id,
      existingMenu.parentId,
      moveMenuDto.newParentId,
      existingMenu.order,
      moveMenuDto.newOrder
    );

    return this.menuRepository.update(id, {
      parentId: moveMenuDto.newParentId,
      order: moveMenuDto.newOrder
    });
  }

  async reorderMenus(parentId: number | null, menuOrders: { id: number; order: number }[]): Promise<Menu[]> {
    const updatedMenus: Menu[] = [];

    for (const { id, order } of menuOrders) {
      const updatedMenu = await this.menuRepository.update(id, { order });
      updatedMenus.push(updatedMenu);
    }

    return updatedMenus;
  }

  private buildTreeStructure(menus: Menu[]): Menu[] {
    const menuMap = new Map<number, Menu>();
    const rootMenus: Menu[] = [];

    // Create menu map
    menus.forEach(menu => {
      menuMap.set(menu.id, { ...menu, children: [] });
    });

    // Build tree structure
    menus.forEach(menu => {
      const menuNode = menuMap.get(menu.id)!;
      
      if (menu.parentId && menuMap.has(menu.parentId)) {
        const parent = menuMap.get(menu.parentId)!;
        parent.children!.push(menuNode);
      } else {
        rootMenus.push(menuNode);
      }
    });

    return rootMenus;
  }

  private async reorderSingleMenu(
  menuId: number,
  oldParentId: number | null,
  newParentId: number | undefined,
  oldOrder: number,
  newOrder: number
  ): Promise<void> {
    // Jika parent tidak berubah, hanya reorder dalam parent yang sama
    if (oldParentId === (newParentId || null)) {
      const siblings = await this.menuRepository.findByParentId(oldParentId);
      
      // Jika menu dipindah ke order yang lebih tinggi
      if (newOrder > oldOrder) {
        // Geser menu di antara oldOrder dan newOrder ke atas
        for (const sibling of siblings) {
          if (sibling.id !== menuId && sibling.order > oldOrder && sibling.order <= newOrder) {
            await this.menuRepository.update(sibling.id, { order: sibling.order - 1 });
          }
        }
      }
      // Jika menu dipindah ke order yang lebih rendah
      else if (newOrder < oldOrder) {
        // Geser menu di antara newOrder dan oldOrder ke bawah
        for (const sibling of siblings) {
          if (sibling.id !== menuId && sibling.order >= newOrder && sibling.order < oldOrder) {
            await this.menuRepository.update(sibling.id, { order: sibling.order + 1 });
          }
        }
      }
    }
    // Jika parent berubah, handle logic yang berbeda
    else {
      // Geser menu di parent lama ke atas (karena menu pindah)
      const oldSiblings = await this.menuRepository.findByParentId(oldParentId);
      for (const sibling of oldSiblings) {
        if (sibling.id !== menuId && sibling.order > oldOrder) {
          await this.menuRepository.update(sibling.id, { order: sibling.order - 1 });
        }
      }
      
      // Geser menu di parent baru ke bawah (untuk memberi ruang)
      const newSiblings = await this.menuRepository.findByParentId(newParentId || null);
      for (const sibling of newSiblings) {
        if (sibling.id !== menuId && sibling.order >= newOrder) {
          await this.menuRepository.update(sibling.id, { order: sibling.order + 1 });
        }
      }
    }
  }

  private async wouldCreateCircularReference(menuId: number, newParentId: number): Promise<boolean> {
    let currentId: number | null = newParentId;
    
    while (currentId !== null) {
      if (currentId === menuId) {
        return true;
      }
      
      const currentMenu = await this.menuRepository.findById(currentId);
      if (!currentMenu || currentMenu.parentId === null) {
        break;
      }
      
      currentId = currentMenu.parentId || null;
    }
    
    return false;
  }
}
