import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthDto } from './dto/auth.dto';
import { compare } from 'bcryptjs';
import { User, UserDocument } from 'src/users/schema/user.schema';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async registerUser(createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  async validateUserCredentials({
    email,
    password,
  }: AuthDto): Promise<AuthResponseDto> {
    const user = await this.userService.findUserByEmail(email);

    if (!user) throw new UnauthorizedException('Invalid Credentials');

    const isPasswordMatch = await compare(password, user.password);

    if (!isPasswordMatch) throw new BadRequestException('Invalud Credentials');

    const accessToken = await this.userService.generateUserAccessToken(user);

    return { accessToken, user };
  }
}
