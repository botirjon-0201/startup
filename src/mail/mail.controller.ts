import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { MailService } from './mail.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { any } from 'joi';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@ApiTags('Mail')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @ApiOperation({ summary: 'Send otp user email' })
  @ApiResponse({ status: 200, type: any })
  @HttpCode(HttpStatus.OK)
  @Post('send-otp')
  async sendOtp(@Body() sendOtpDto: SendOtpDto) {
    return this.mailService.sendOtpVerification(sendOtpDto);
  }

  @ApiOperation({ summary: 'Verify otp sent by user' })
  @ApiResponse({ status: 200, type: any })
  @HttpCode(HttpStatus.OK)
  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.mailService.verifyOtp(verifyOtpDto);
  }
}
