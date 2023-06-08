import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/models/user.model';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { compare, genSalt, hash } from 'bcrypt';
import { TokenUserDto } from '../user/dto/token-user.dto';
import { CheckUserDto } from '../user/dto/check-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    const user = await this.findUserByEmail(email);
    if (user) throw new BadRequestException('already_exist');

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    const newUser = await this.userModel.create({
      ...createUserDto,
      password: password.length ? hashedPassword : '',
    });

    const token = await this.issueTokenPair(String(newUser._id));
    return { user: this.getUserField(newUser), token };
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.findUserByEmail(email);
    if (!user) throw new BadRequestException('user_not_found');

    if (password.length) {
      const isMatchPassword = await compare(password, user.password);
      if (!isMatchPassword) throw new BadRequestException('incorrect_password');
    }

    const token = await this.issueTokenPair(String(user._id));
    return { user: this.getUserField(user), token };
  }

  async getNewTokens({ refreshToken }: TokenUserDto) {
    if (!refreshToken) throw new UnauthorizedException('Please sign in!');

    const result = await this.jwtService.verifyAsync(refreshToken);
    if (!result) throw new UnauthorizedException('Invalid token or expired!');

    const user = await this.userModel.findById(result._id);
    const token = await this.issueTokenPair(String(user._id));

    return { user: this.getUserField(user), token };
  }

  async checkUser({ email }: CheckUserDto) {
    const user = await this.findUserByEmail(email);
    return user ? 'user' : 'no-user';
  }

  async findUserByEmail(email: string): Promise<UserDocument> {
    return await this.userModel.findOne({ email });
  }

  async issueTokenPair(userId: string) {
    const jwtPayload = { _id: userId };

    const [refreshToken, accessToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        // secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),

      this.jwtService.signAsync(jwtPayload, {
        // secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);

    return { refreshToken, accessToken };
  }

  getUserField(user: UserDocument) {
    return {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      avatar: user.avatar,
      role: user.role,
    };
  }
}
