import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type OtpDocument = HydratedDocument<Otp>;

@Schema({ timestamps: true })
export class Otp {
  @ApiProperty({ example: 'ali@gmail.com', description: 'User email' })
  @Prop()
  email: string;

  @ApiProperty({ example: '1584', description: 'Otp number' })
  @Prop()
  otp: string;

  @ApiProperty({ example: '2020-01-01', description: 'Otp expire time' })
  @Prop()
  expireAt: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
