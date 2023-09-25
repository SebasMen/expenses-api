import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SpacesService } from './spaces.service';
import { SpacesController } from './spaces.controller';

import { Space } from './entities/space.entity';

@Module({
  controllers: [SpacesController],
  providers: [SpacesService],
  imports: [TypeOrmModule.forFeature([Space])],
})
export class SpacesModule {}
