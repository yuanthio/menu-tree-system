import { IsInt, Min, IsOptional } from 'class-validator';

export class MoveMenuDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  newParentId?: number;

  @IsInt()
  @Min(0)
  newOrder: number;
}