import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';

import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

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
      this.handleDbException(error);
    }
  }

  async findAll(pagination: PaginationDto) {
    const { limit = 10, offset = 0 } = pagination;

    return await this.spaceRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async findOne(term: string) {
    let space: Space;

    if (isUUID(term)) {
      space = await this.spaceRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.spaceRepository.createQueryBuilder();
      space = await queryBuilder
        .where(`UPPER(name)=:name`, {
          name: term.toUpperCase(),
        })
        .getOne();
    }

    if (!space) {
      throw new BadRequestException(`Space with id ${term} not found`);
    }

    return space;
  }

  async update(id: string, updateSpaceDto: UpdateSpaceDto) {
    const space = await this.spaceRepository.preload({
      id,
      ...updateSpaceDto,
    });

    if (!space) {
      throw new BadRequestException(`Space with id ${id} not found`);
    }

    try {
      await this.spaceRepository.save(space);
      return space;
    } catch (error) {
      this.handleDbException(error);
    }
  }

  async remove(id: string) {
    const space = await this.findOne(id);

    await this.spaceRepository.remove(space);
    return { message: 'Space deleted successfully' };
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
