import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { DayCategory } from '../../../common/enums/category.enum';

export class CreateDayTemplateDto {
  @IsNumber()
  @Min(1)
  @Max(31)
  dayNumber: number;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsEnum(DayCategory)
  category: DayCategory;

  @IsOptional()
  points?: number = 1;

  @IsOptional()
  @IsBoolean()
  requiresPhoto?: boolean = false;
}
