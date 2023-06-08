import {
  Controller,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './models/user.model';
import { Roles } from '../decorators/role.decorator';
import { GetUser } from '../decorators/user.decorator';
import { PasswordUserDto } from './dto/password-user.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get profile' })
  @ApiResponse({ status: 200, type: User })
  @HttpCode(HttpStatus.OK)
  @Get('profile')
  @Roles()
  async getProfile(@GetUser('_id') _id: string): Promise<any> {
    return this.userService.findById(_id);
  }

  @ApiOperation({ summary: 'Update password' })
  @ApiResponse({ status: 200, type: User })
  @HttpCode(HttpStatus.OK)
  @Put('edit-password')
  async updatePassword(@Body() passwordUserDto: PasswordUserDto) {
    return this.userService.updatePassword(passwordUserDto);
  }
}
