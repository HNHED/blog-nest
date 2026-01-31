import { IsString, IsArray, IsOptional, IsObject } from 'class-validator';

export class CoverConfigDto {
  @IsString()
  template: 'gradient' | 'pattern' | 'minimal' | 'card';

  @IsString()
  primaryColor: string;

  @IsString()
  secondaryColor: string;

  @IsString()
  textColor: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsString()
  layout: 'center' | 'left' | 'bottom';
}

export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsArray()
  tags: string[];

  @IsOptional()
  @IsObject()
  coverConfig?: CoverConfigDto;
}