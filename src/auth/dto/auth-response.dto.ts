import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { User } from 'src/users/schema/user.schema';

export class AuthResponseDto {
  @ApiProperty()
  @IsString()
  accessToken: string;

  @ApiProperty()
  @IsString()
  user: User;
}
