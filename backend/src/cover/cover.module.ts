import { Module } from '@nestjs/common';
import { CoverController } from './cover.controller';
import { CoverService } from './cover.service';

@Module({
  controllers: [CoverController],
  providers: [CoverService]
})
export class CoverModule {}
