export class CreateUserDto {
    FIO: string;
    phoneNumber: string;
    email: string;
    password: string;
    role: string;
    isConfirmed: boolean;
    activationCode: string;
}
