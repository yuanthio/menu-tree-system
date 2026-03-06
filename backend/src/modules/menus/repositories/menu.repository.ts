import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Menu } from '../entities/menu.entity';

@Injectable()
export class MenuRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Menu[]> {
    return this.prisma.menu.findMany({
      orderBy: [
        { parentId: 'asc' },
        { order: 'asc' }
      ],
      include: {
        children: {
          orderBy: {
            order: 'asc'
          }
        },
        parent: true
      }
    });
  }

  async findById(id: number): Promise<Menu | null> {
    return this.prisma.menu.findUnique({
      where: { id },
      include: {
        children: {
          orderBy: {
            order: 'asc'
          }
        },
        parent: true
      }
    });
  }

  async create(data: {
    name: string;
    url?: string;
    icon?: string;
    parentId?: number;
    order: number;
  }): Promise<Menu> {
    return this.prisma.menu.create({
      data,
      include: {
        children: true,
        parent: true
      }
    });
  }

  async update(id: number, data: {
    name?: string;
    url?: string;
    icon?: string;
    parentId?: number;
    order?: number;
  }): Promise<Menu> {
    return this.prisma.menu.update({
      where: { id },
      data,
      include: {
        children: true,
        parent: true
      }
    });
  }

  async delete(id: number): Promise<Menu> {
    return this.prisma.menu.delete({
      where: { id },
      include: {
        children: true,
        parent: true
      }
    });
  }

  async findByParentId(parentId: number | null): Promise<Menu[]> {
    return this.prisma.menu.findMany({
      where: { parentId },
      orderBy: { order: 'asc' },
      include: {
        children: {
          orderBy: {
            order: 'asc'
          }
        },
        parent: true
      }
    });
  }

  async findMaxOrderByParentId(parentId: number | null): Promise<number> {
    const result = await this.prisma.menu.aggregate({
      where: { parentId },
      _max: {
        order: true
      }
    });
    
    return result._max.order || 0;
  }
}
