import { IsEmail, IsPhoneNumber, IsString } from "class-validator";

export class RegisterDto {
    @IsString()
    FIO: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsString()
    role: string;

    activationCode: string;
    isConfirmed: boolean;
}