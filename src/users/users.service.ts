import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schema/user.schema';
import { hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const user = await this.findUserByEmail(createUserDto.email);

    if (user) throw new BadRequestException('Given email already exist');

    createUserDto.password = await hash(createUserDto.password, 10);

    return this.userModel.create(createUserDto);
  }

  async findUserById(userId: string) {
    const user = await this.userModel.findById(userId);

    return user;
  }

  async findUserByEmail(email: string) {
    const user = await this.userModel.findOne({ email });

    return user;
  }

  generateUserAccessToken(user: UserDocument) {
    return this.jwtService.sign(
      { userId: user._id },
      { secret: this.configService.get<'string'>('JWT_SECRET') },
    );
  }
}
