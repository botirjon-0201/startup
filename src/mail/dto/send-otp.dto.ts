import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendOtpDto {
  @ApiProperty({ example: 'ali@gmail.com', description: 'User email' })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ example: true, description: 'Is User' })
  @IsNotEmpty()
  @IsBoolean()
  isUser: boolean;
}
