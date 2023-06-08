import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({ example: 'ali@gmail.com', description: 'User email' })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '158467', description: 'Otp verify number' })
  @IsNotEmpty()
  @IsString()
  otpVerification: string;
}
