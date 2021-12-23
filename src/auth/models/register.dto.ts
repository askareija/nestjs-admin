import { IsAlphanumeric, IsEmail, IsNotEmpty } from 'class-validator';

export class registerDto {
  @IsNotEmpty()
  @IsAlphanumeric()
  first_name: string;

  @IsAlphanumeric()
  last_name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  password_confirmation: string;
}
