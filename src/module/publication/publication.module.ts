import { Module } from '@nestjs/common';
import { PublicationController } from './publication.controller';
import { PublicationService } from './publication.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Publication } from './Dto/publication.entity';
import { Tag } from './Dto/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Publication, Tag])],
  controllers: [PublicationController],
  providers: [PublicationService]
})
export class PublicationModule {}
