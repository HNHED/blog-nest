import { IsObject, ValidateNested } from 'class-validator';
  import { Type } from 'class-transformer';
  import { CoverConfigDto } from './create-post.dto';

  export class UpdateCoverDto {
    @IsObject()
    @ValidateNested()
    @Type(() => CoverConfigDto)
    coverConfig: CoverConfigDto;
  }