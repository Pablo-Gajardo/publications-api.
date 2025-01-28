import { Injectable } from '@nestjs/common';
import { PublicationDto } from './Dto/publication.dto';

@Injectable()
export class PublicationService {

    async createPublication(publication:PublicationDto){
            return 'Publicacion creada, gracias '+publication.title+ publication.tags[0];
        }

    async changeStatePublication(id:number){
        return 'Publicacion actualizada, gracias '+ id;
    }

    async getPublications(){
        return 'Publicaciones obtenidas';
    }

    async getTags(){
        return 'Tareas obtenidas';
    }

    async setPublication(id:number, publication:PublicationDto){
        return 'Publicacion actualizada, gracias '+ id + 'con la publicacion '+ publication.title;
    }

    async deletePublication(id:number){
        return 'Publicacion eliminada, gracias '+id;
    }

    async getPublicationsArr(idArray:Array<number>){
        return 'Publicaciones obtenidas, gracias '+idArray;
    }
}
