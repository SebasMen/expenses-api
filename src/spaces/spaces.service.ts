import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';

import { Space } from './entities/space.entity';

@Injectable()
export class SpacesService {
  private readonly logger = new Logger(SpacesService.name);
  constructor(
    @InjectRepository(Space)
    private readonly spaceRepository: Repository<Space>,
  ) {}

  async create(createSpaceDto: CreateSpaceDto) {
    try {
      const space = this.spaceRepository.create(createSpaceDto);
      await this.spaceRepository.save(space);
      return space;
    } catch (error) {
      console.log(error);
      this.handleDbException(error);
    }
  }

  findAll() {
    return `This action returns all spaces`;
  }

  findOne(id: number) {
    return `This action returns a #${id} space`;
  }

  update(id: number, updateSpaceDto: UpdateSpaceDto) {
    return `This action updates a #${id} space`;
  }

  remove(id: number) {
    return `This action removes a #${id} space`;
  }

  private handleDbException(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
