import { forwardRef, Module } from '@nestjs/common';
import { MailingService } from './mailing.service';
import { MailingController } from './mailing.controller';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [MailingService, ConfigService],
  controllers: [MailingController],
  imports: [forwardRef(() => AuthModule)],
  exports: [MailingService],
})
export class MailingModule {}
