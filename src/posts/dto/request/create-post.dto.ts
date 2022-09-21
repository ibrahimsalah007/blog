import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ description: 'Post Title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Post Description' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'Post Cover Image' })
  @IsString()
  cover: string;

  @ApiProperty({ description: 'Post Tags' })
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({ description: 'Post Publishing Status', required: false })
  @IsBoolean()
  @IsOptional()
  published: boolean;
}
