import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@kobi.com' })
  @IsEmail({}, { message: 'সঠিক ইমেইল দিন' })
  email: string;

  @ApiProperty({ example: 'ChangeMe@123', minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে' })
  password: string;
}