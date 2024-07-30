import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaModule } from "./prisma/prisma.module";
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MailingModule } from './mailing/mailing.module';
import { UsersModule } from './users/users.module';
import { PollModule } from './poll/poll.module';
import { PollService } from './poll/poll.service';
import { PollController } from './poll/poll.controller';
import { CoverModule } from './cover/cover.module';
@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    MailingModule,
    UsersModule,
    PollModule,
    CoverModule
  ],
  controllers: [PollController],
  providers: [AppService, PollService],
})
export class AppModule {}
