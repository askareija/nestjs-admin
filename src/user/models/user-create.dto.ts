import { IsAlphanumeric, IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class UserCreateDto {
  @IsNotEmpty()
  @IsAlphanumeric()
  first_name: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  last_name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  role_id: number;
}
