import { Injectable } from '@nestjs/common';
import { PublicationDto } from './Dto/publication.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {Publication} from './Dto/publication.entity';
import { Tag } from './Dto/tag.entity';
import { Repository, In } from 'typeorm';

@Injectable()
export class PublicationService {
    constructor(@InjectRepository(Publication) private publicationRepocitory: Repository<Publication>,
                @InjectRepository(Tag) private tagRepository: Repository<Tag>) {}

    
    async createPublication(publication:PublicationDto){
            const tags = await this.tagRepository.findByIds(publication.tags);
            const newPublication = this.publicationRepocitory.create({ ...publication, tags });
            return await this.publicationRepocitory.save(newPublication);
        }

    async changeStatePublication(id:number){
        const publication = await this.getPublication(id);
        this.publicationRepocitory.update(id, { status: !publication.status });
        this.publicationRepocitory.update(id, { modificationDate: new Date() });
        return 'Publicacion actualizada, gracias ' + !publication.status + ' con el id ' + id;
    }

    async getPublications() {
        const publications = await this.publicationRepocitory.find({ relations: ['tags'] });
        return publications.map(publication => ({
            ...publication,
            tags: publication.tags.map(tag => ({ id: tag.id, name: tag.name }))
        }));
    }

    async getTags(){
        return await this.tagRepository.find();
    }

    async setPublication(id:number, publication:PublicationDto){
        await this.deletePublication(id);
        await this.createPublication({...publication, id});
        return 'Publicacion con el id : ' + id+ ' actualizada exitosamente a \n' + this.getPublication(id);
    }

    async deletePublication(id:number){
        await this.publicationRepocitory.delete(id);
        return { message :'Publicacion eliminada exitosamente', idDeleted: id};
    }

    async getPublicationsArr(idArray:Array<number>){
        const publications = await this.publicationRepocitory.find({ where: { id: In(idArray) }, relations: ['tags'] });
        return publications.map(publication => ({
            ...publication,
            tags: publication.tags.map(tag => ({ id: tag.id, name: tag.name }))
        }));
    }

    async getPublication(id:number){
    return this.publicationRepocitory.findOne({ where: { id }, relations: ['tags'] });
    }

}
