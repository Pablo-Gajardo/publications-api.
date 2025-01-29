import { Injectable } from '@nestjs/common';
import { PublicationDto } from './Dto/publication.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {Publication} from './Dto/publication.entity';
import { Tag } from './Dto/tag.entity';
import { Repository, In } from 'typeorm';

import { PDFDocument, rgb } from 'pdf-lib';
import * as fs from 'fs';

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
        return await this.getPublication(id);
       // return await'Publicacion con el id : ' + id+ ' actualizada exitosamente a \n' + pucationNow;
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

async getPDF() {

    const data = await this.getPublications();
        const pdfDoc = await PDFDocument.create();
        let page = pdfDoc.addPage([600, 800]);   

        const { height } = page.getSize();
        
        page.drawText('Publicaciones DCI', {
            x: 50,
            y: height - 50,
            size: 18,
            color: rgb(0, 0, 0),
        });

        let yPosition = height - 80;

        for (const item of data) {
            if (yPosition < 100) { 
                page = pdfDoc.addPage([600, 800]);
                yPosition = height - 50;
            }

            page.drawText(`Título: ${item.title}`, { x: 50, y: yPosition, size: 10 });
            page.drawText(`Descripción: ${item.description}`, { x: 50, y: yPosition - 15, size: 10 });
            page.drawText(`Fecha de Publicación: ${item.publicationDate}`, { x: 50, y: yPosition - 30, size: 10 });
            page.drawText(`Fecha de Inicio: ${item.startDate}`, { x: 50, y: yPosition - 45, size: 10 });
            page.drawText(`Fecha de Fin: ${item.endDate}`, { x: 50, y: yPosition - 60, size: 10 });
            page.drawText(`Profesor(a): ${item.nameTeacher}`, { x: 50, y: yPosition - 75, size: 10 });

            const tags = item.tags.map((tag: { name: string }) => tag.name).join(', ');
            page.drawText(`Etiquetas: ${tags}`, { x: 50, y: yPosition - 90, size: 10 });
            yPosition -= 120; 
        }

        const pdfBytes = await pdfDoc.save();
        const currentDate = new Date().toISOString().split('T')[0];
        const outputPath = `FDF_generate_Publications_DCI/publicaciones_DCI_${currentDate}.pdf`;
        fs.writeFileSync(outputPath, pdfBytes);

        return {
            message: 'PDF generado exitosamente'
        };
    };





    async saveImageAndCreatePublication(file: Express.Multer.File, publication: PublicationDto) {
        const imagePath = `img/${file.filename}-${Date.now()}.png`;
        fs.writeFileSync(imagePath, file.buffer);

        const newPublication = await this.createPublication({ ...publication, image: imagePath });

        return {
            message: 'Publicación creada y imagen guardada exitosamente',
            publication: newPublication,
        };
    }

}
