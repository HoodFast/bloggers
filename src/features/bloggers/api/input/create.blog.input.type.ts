import { Trim } from '../../../../base/validate/trim';
import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class createBlogInput {
  @Trim()
  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  name: string;
  @Trim()
  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  description: string;
  @Trim()
  @IsNotEmpty()
  @IsString()
  @Matches('^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$')
  @MaxLength(100)
  websiteUrl: string;
}
