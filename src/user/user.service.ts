import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './models/user.model';
import { Model } from 'mongoose';
import { PasswordUserDto } from './dto/password-user.dto';
import { genSalt, hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async findById(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async updatePassword(passwordUserDto: PasswordUserDto) {
    const { email, password } = passwordUserDto;

    const user = await this.userModel.findOne({ email });
    if (!user) throw new UnauthorizedException('user_not_found');

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    await this.userModel.findByIdAndUpdate(
      user._id,
      { $set: { password: hashedPassword } },
      { new: true },
    );

    return 'Success';
  }
}
