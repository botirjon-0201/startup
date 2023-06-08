import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Otp, OtpDocument } from './models/otp.model';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/models/user.model';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';
import { compare, genSalt, hash } from 'bcrypt';

@Injectable()
export class MailService {
  constructor(
    @InjectModel(Otp.name) private otpModel: Model<OtpDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
  ) {
    SendGrid.setApiKey(this.configService.get<string>('SEND_GRID_KEY'));
  }

  async sendOtpVerification(sendOtpDto: SendOtpDto) {
    const { email, isUser } = sendOtpDto;

    if (!email) throw new ForbiddenException('email_is_required');

    if (isUser) {
      const user = await this.userModel.findOne({ email });
      if (!user) throw new UnauthorizedException('user_not_found');
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const salt = await genSalt(10);
    const hashedOtp = await hash(String(otp), salt);
    const emailData = {
      to: email,
      subject: 'Verification email',
      from: this.configService.get<string>('SEND_GRID_USER'),
      html: `
				<h1>Verification Code: ${otp}</h1>
			`,
    };
    await this.otpModel.create({
      email: email,
      otp: hashedOtp,
      expireAt: Date.now() + 3600000,
    });
    await SendGrid.send(emailData);
    return 'Success';
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { email, otpVerification } = verifyOtpDto;

    if (!otpVerification)
      throw new BadRequestException('send_otp_verification');

    const userExistOtp = await this.otpModel.find({ email });
    const { expireAt, otp } = userExistOtp.slice(-1)[0];

    if (expireAt < new Date()) {
      await this.otpModel.deleteMany({ email });
      throw new BadRequestException('expired_code');
    }

    const validOtp = await compare(otpVerification, otp);
    if (!validOtp) throw new BadRequestException('otp_is_incorrect');

    await this.otpModel.deleteMany({ email });
    return 'Success';
  }
}
