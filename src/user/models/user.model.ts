import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type RoleUser = 'ADMIN' | 'INSTRUCTOR' | 'USER';

export type UserDocument = HydratedDocument<User>;

export type UserTypeData = keyof UserDocument;

@Schema({ timestamps: true })
export class User {
  @ApiProperty({ example: 'ali@gmail.com', description: 'User email' })
  @Prop({ unique: true, required: true })
  email: string;

  @ApiProperty({ example: '123456', description: 'User password' })
  @Prop()
  password: string;

  @ApiProperty({ example: 'ali valiyev', description: 'User fullname' })
  @Prop()
  fullName: string;

  @ApiProperty({ example: 'USER', description: 'User role' })
  @Prop()
  role: RoleUser;

  @ApiProperty({ example: 'ali.img', description: 'User avatar' })
  @Prop()
  avatar: string;

  @ApiProperty({ example: 'developer', description: 'User job' })
  @Prop()
  job: string;

  @ApiProperty({ example: '2020-01-01', description: 'User created time' })
  @Prop()
  createdAt: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
