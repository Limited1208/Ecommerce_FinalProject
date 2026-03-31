import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { StatService } from './stats.service';

@Module({
  controllers: [StatsController],
  providers: [StatService]
})
export class StatsModule {}
