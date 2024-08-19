import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { MailingService } from "src/mailing/mailing.service";
import { RegisterDto } from './dto/register.dto';
import { hash, verify } from "argon2";
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    token: string;
    constructor(private prismaService: PrismaService,
        private jwt: JwtService,
        private config: ConfigService,
        private mailing: MailingService) { }

    async register(dto: RegisterDto) {
        try {
            const existingUser = await this.prismaService.user.findFirst({
                where: {
                    email: dto.email
                }
            });

            if (existingUser) {
                throw new BadRequestException('User already exists')
            }

            const user = await this.prismaService.user.create({
                data: {
                    FIO: dto.FIO,
                    email: dto.email,
                    password: await hash(dto.password),
                    role: dto.role,
                    isConfirmed: false,
                }
            });
            await this.mailing.sendMail(dto.email, user.activationCode);
            return user;
        } catch (error) {
            console.error('Error when registering a user: ', error);
        }
    }

    async login(dto: LoginDto) {
        const user = await this.validateUser(dto);
        if (!user) {
            throw new BadRequestException('User not found');
        } else if (user.activationCode === null) {
            throw new BadRequestException('Check email to activate your account');
        }

        if (!user.isConfirmed && user.activationCode !== null) {
            if (user.activationCode.toLowerCase() === dto.activationCode.toLowerCase()) {
                await this.prismaService.user.update({
                    where: {
                        id: +user.id
                    },
                    data: {
                        isConfirmed: true,
                    }
                });
                return this.signToken(user.id, user.email, user.role, user.isConfirmed);
            } else {
                throw new BadRequestException('Invalid activation code');
            }
        }

        if (!user.isConfirmed && dto.activationCode === null) {
            return this.signToken(user.id, user.email, user.role, user.isConfirmed);
        } else if (user.isConfirmed) {
            return this.signToken(user.id, user.email, user.role, user.isConfirmed);
        }
    }

    async validateUser(dto: LoginDto) {
        const user = await this.prismaService.user.findFirst({
            where: {
                email: dto.email
            }
        });

        if (!user) {
            throw new BadRequestException('User not found');
        }

        const isCorrectPassword = await verify(user.password, dto.password);
        if (!isCorrectPassword) {
            throw new BadRequestException('Invalid password');
        }
        return user;
    }

    async signToken(
        userId: number,
        email: string,
        role: string,
        isConfirmed: boolean
    ): Promise<{ access_token: string }> {
        const payload = { sub: userId, email, role, isConfirmed };
        const secret = this.config.get('JWT_SECRET');
        const token = await this.jwt.signAsync(payload, {
            expiresIn: '1d',
            secret: secret,
        });
        return { access_token: token };
    }

    async logout() {
        this.token = null; 
        return { message: 'Logged out' };
    }
}
