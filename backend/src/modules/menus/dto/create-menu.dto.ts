import { IsString, IsOptional, IsInt, Min, MaxLength } from 'class-validator';

export class CreateMenuDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  parentId?: number;
}