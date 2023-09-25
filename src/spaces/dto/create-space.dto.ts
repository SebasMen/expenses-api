import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateSpaceDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  totalExpenses: number;
}
