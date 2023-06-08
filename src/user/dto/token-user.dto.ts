import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TokenUserDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCIkpXVCJ9.eyJfaWQiOiI2NDgwN2ZTU4ZmZkYzQ5OWVkOWNjOGQiLCJpYXQiOjE2ODYyMTkxOTAsImV4cCI6MTY4NjIyMDA5MH0.XkuJElK7aX_LlIzM3WX_bABgV4B_IYQbuGJr1c5u0',
    description: 'Refresh token',
  })
  @IsNotEmpty({ message: 'Refresh token is required' })
  @IsString({ message: 'You did not pass refresh token or it is not a string' })
  refreshToken: string;
}
