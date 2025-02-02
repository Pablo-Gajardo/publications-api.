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

    
    /**
     * Creates a new publication with the provided data.
     * 
     * @param {PublicationDto} publication - The data transfer object containing the details of the publication to be created.
     * @returns {Promise<Publication>} - A promise that resolves to the newly created publication.
     * 
     * @throws {Error} - Throws an error if the publication cannot be created.
     */
    async createPublication(publication:PublicationDto){
            const tags = await this.tagRepository.findByIds(publication.tags);
            const newPublication = this.publicationRepocitory.create({ ...publication, tags });
            return await this.publicationRepocitory.save(newPublication);
        }

    /**
     * Changes the state of a publication by toggling its status and updating the modification date.
     * 
     * @param {number} id - The ID of the publication to be updated.
     * @returns {Promise<string>} A message indicating the updated status and the publication ID.
     * 
     * @throws {Error} If the publication with the given ID is not found.
     */
    async changeStatePublication(id:number){
        const publication = await this.getPublication(id);
        this.publicationRepocitory.update(id, { status: !publication.status });
        this.publicationRepocitory.update(id, { modificationDate: new Date() });
        return 'Publicacion actualizada, gracias ' + !publication.status + ' con el id ' + id;
    }

    /**
     * Retrieves all publications with their associated tags.
     * 
     * This method fetches all publications from the repository, including their related tags.
     * It then maps over the publications to format the tags as an array of objects containing
     * only the tag id and name.
     * 
     * @returns {Promise<Array<{ id: number, name: string, tags: Array<{ id: number, name: string }> }>>} 
     *          A promise that resolves to an array of publications, each with an array of tags.
     */
    async getPublications() {
        const publications = await this.publicationRepocitory.find({ relations: ['tags'] });
        return publications.map(publication => ({
            ...publication,
            tags: publication.tags.map(tag => ({ id: tag.id, name: tag.name }))
        }));
    }

    /**
     * Retrieves all tags from the repository.
     *
     * @returns {Promise<Tag[]>} A promise that resolves to an array of tags.
     */
    async getTags(){
        return await this.tagRepository.find();
    }

    /**
     * Updates a publication with the given ID by deleting the existing one, saving a new image, 
     * and creating a new publication with the provided data.
     * 
     * @param id - The ID of the publication to update.
     * @param publication - The data transfer object containing the publication details.
     * @param image - The image file to be associated with the publication.
     * 
     * @returns The updated publication.
     * 
     * @throws Will throw an error if the publication cannot be deleted, the image cannot be saved, 
     * or the new publication cannot be created or saved.
     */
    async setPublication(id: number, publication: PublicationDto, image: Express.Multer.File) {
        await this.deletePublication(id);
        const { message, path } = await this.saveImage(image, publication.title);
        const tags = await this.tagRepository.findBy({ id: In(publication.tags) });
        const newPublication = this.publicationRepocitory.create({ ...publication, id, image: path, tags });
        await this.publicationRepocitory.save(newPublication);
        return await this.getPublication(id);
    }

    /**
     * Deletes a publication by its ID.
     *
     * @param {number} id - The ID of the publication to delete.
     * @returns {Promise<{ message: string, idDeleted: number }>} A promise that resolves to an object containing a success message and the ID of the deleted publication.
     */
    async deletePublication(id:number){
        await this.publicationRepocitory.delete(id);
        return { message :'Publicacion eliminada exitosamente', idDeleted: id};
    }

    /**
     * Retrieves an array of publications based on the provided array of publication IDs.
     * Each publication will include its associated tags with only the tag ID and name.
     *
     * @param idArray - An array of publication IDs to retrieve.
     * @returns A promise that resolves to an array of publications, each with its associated tags.
     */
    async getPublicationsArr(idArray:Array<number>){
        const publications = await this.publicationRepocitory.find({ where: { id: In(idArray) }, relations: ['tags'] });
        return publications.map(publication => ({
            ...publication,
            tags: publication.tags.map(tag => ({ id: tag.id, name: tag.name }))
        }));
    }

    /**
     * Retrieves a publication by its ID, including its associated tags.
     *
     * @param {number} id - The ID of the publication to retrieve.
     * @returns {Promise<Publication>} A promise that resolves to the publication with the specified ID, including its tags.
     */
    async getPublication(id:number){
    return this.publicationRepocitory.findOne({ where: { id }, relations: ['tags'] });
    }

    /**
     * Generates a PDF document containing a list of publications.
     * 
     * This method retrieves publication data, creates a PDF document, and adds pages with publication details.
     * Each page includes the title, description, publication date, start date, end date, teacher's name, and tags.
     * If the content exceeds the page height, a new page is added.
     * The generated PDF is saved to the file system with a name that includes the current date.
     * 
     * @returns {Promise<string>} The name of the generated PDF file.
     */
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
        const namePdf = `publicaciones_DCI_${currentDate}.pdf`;
        const outputPath = `PDF_generate_Publications_DCI/${namePdf}`;
        fs.writeFileSync(outputPath, pdfBytes);

        return namePdf;
    };

    /**
     * Saves an image and creates a new publication.
     *
     * @param {Express.Multer.File} image - The image file to be saved.
     * @param {PublicationDto} publication - The publication data transfer object containing publication details.
     * @returns {Promise<{ message: string, path: string }>} - An object containing a message and the path to the saved image.
     *
     * @throws {Error} - Throws an error if saving the image or creating the publication fails.
     */
    async saveImageAndCreatePublication(image: Express.Multer.File, publication: PublicationDto) {
        console.log(publication.title);
        const { message, path } = await this.saveImage(image, publication.title);
        const tags = await this.tagRepository.findBy({ id: In(publication.tags) });
        const newPublication = this.publicationRepocitory.create({ ...publication, image: path, tags });
        await this.publicationRepocitory.save(newPublication);
        return { message, path };
    }

    
    /**
     * Saves an image file to the local file system with a sanitized title and current date.
     *
     * @param {Express.Multer.File} file - The image file to be saved.
     * @param {string} title - The title of the image, which will be sanitized and used in the file name.
     * @returns {Promise<{ message: string, path: string }>} An object containing a success message and the path where the image was saved.
     */
    async saveImage(file: Express.Multer.File, title: string) {
        const currentDate = new Date().toISOString().split('T')[0];
        const sanitizedTitle = title.replace(/ /g, '_');
        const imagePath = `img/${sanitizedTitle}-${currentDate}.png`;
        fs.writeFileSync(imagePath, file.buffer);
        return {
            message: 'Imagen guardada exitosamente',
            path: imagePath
        };
    }
}
