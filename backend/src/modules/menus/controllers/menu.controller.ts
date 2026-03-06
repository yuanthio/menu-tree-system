import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { MenuService } from '../services/menu.service';
import { CreateMenuDto } from '../dto/create-menu.dto';
import { UpdateMenuDto } from '../dto/update-menu.dto';
import { MoveMenuDto } from '../dto/move-menu.dto';

@Controller('menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  async findAll() {
    return {
      success: true,
      message: 'Menus retrieved successfully',
      data: await this.menuService.findAll(),
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const menuId = parseInt(id, 10);
    return {
      success: true,
      message: 'Menu retrieved successfully',
      data: await this.menuService.findById(menuId),
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createMenuDto: CreateMenuDto) {
    return {
      success: true,
      message: 'Menu created successfully',
      data: await this.menuService.create(createMenuDto),
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    const menuId = parseInt(id, 10);
    return {
      success: true,
      message: 'Menu updated successfully',
      data: await this.menuService.update(menuId, updateMenuDto),
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const menuId = parseInt(id, 10);
    await this.menuService.delete(menuId);
    return {
      success: true,
      message: 'Menu deleted successfully',
    };
  }

  @Patch(':id/move')
  async moveMenu(@Param('id') id: string, @Body() moveMenuDto: MoveMenuDto) {
    const menuId = parseInt(id, 10);
    return {
      success: true,
      message: 'Menu moved successfully',
      data: await this.menuService.moveMenu(menuId, moveMenuDto),
    };
  }

  @Patch(':id/reorder')
  async reorderMenu(
    @Param('id') id: string,
    @Body() reorderDto: { order: number }
  ) {
    const menuId = parseInt(id, 10);
    
    // Get current menu untuk mendapatkan data lama
    const currentMenu = await this.menuService.findById(menuId);
    
    // Gunakan moveMenu logic untuk handle reorder yang benar
    const moveMenuDto = {
      newParentId: currentMenu.parentId || undefined, // Convert null ke undefined
      newOrder: reorderDto.order
    };
    
    return {
      success: true,
      message: 'Menu reordered successfully',
      data: await this.menuService.moveMenu(menuId, moveMenuDto),
    };
  }
}
