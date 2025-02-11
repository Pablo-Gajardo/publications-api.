import { Controller, Post, Get, Delete, Body, UseInterceptors, UploadedFile, UploadedFiles, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Res, Put } from '@nestjs/common';
import { PublicationService } from './publication.service';
import { PublicationDto } from './Dto/publication.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CONFIGURABLE_MODULE_ID } from '@nestjs/common/module-utils/constants';
import { of } from 'rxjs';
import { join } from 'path';



@Controller('/publication')
/**
 * Controller for handling publication-related operations.
 */
export class PublicationController {
  /**
   * Creates an instance of PublicationController.
   * @param PublicationService - The service used for publication operations.
   */
  constructor(private PublicationService: PublicationService) {}

  /**
   * Endpoint to get the state of publications.
   * @returns A string indicating that publications are online.
   */
  @Get('/')
  getstate() {
    return 'Publicaciones online';
  }

  /**
   * Endpoint to create a new publication in the database.
   * 
   * @param image - The uploaded image file.
   * @param publicationString - The publication data in JSON string format.
   * @returns A success message or an error object if the publication processing fails.
   * 
   * @throws Will throw an error if the publicationString is not a valid JSON.
   */
  @Post('/create')
  @UseInterceptors(FileInterceptor('image'))
  async CreatePublcation(
    @UploadedFile(new ParseFilePipe()) image: Express.Multer.File,
    @Body('publication') publicationString: string,
  ) {
    try {
      const publication: PublicationDto = JSON.parse(publicationString); // Parse the string to an object
      await this.PublicationService.saveImageAndCreatePublication(image, publication);
      return 'Imagen guardada y publicación creada';
    } catch (error) {
      console.error("Error al procesar la publicación:", error);
      return { error: 'Error al procesar la publicación. Asegúrese de que el JSON sea válido.' };
    }
  }

  /**
   * Endpoint to change the state of a publication.
   * @param id - The ID of the publication to change state.
   * @returns The result of the state change operation.
   */
  @Put('/changeState')
  changeStatePublication(@Body() id: { id: number }) {
    return this.PublicationService.changeStatePublication(id.id);
  }

  /**
   * Endpoint to get tags.
   * @returns The tags from the service.
   */
  @Get('/getTags')
  getTask() {
    return this.PublicationService.getTags();
  }

  /**
   * Endpoint to get all publications.
   * @returns The publications from the service.
   */
  @Get('/getPublications')
  getPublications() {
    return this.PublicationService.getPublications();
  }

  /**
   * Endpoint to update an existing publication.
   * 
   * @param image - The uploaded image file.
   * @param publicationString - The publication data in JSON string format.
   * @param id - The ID of the publication to update.
   * @returns A success message or an error object if the publication processing fails.
   * 
   * @throws Will throw an error if the publicationString is not a valid JSON.
   */
  @Put('/setPublication')
  @UseInterceptors(FileInterceptor('image'))
  async setPublication(
    @UploadedFile(new ParseFilePipe()) image: Express.Multer.File,
    @Body('publication') publicationString: string,
    @Body('id') id: number
  ) {
    try {
      const publication: PublicationDto = JSON.parse(publicationString); // Parse the string to an object
      await this.PublicationService.setPublication(id, publication, image);
      return 'publicación ' + id + ' modificada exitosamente';
    } catch (error) {
      console.error("Error al procesar la publicación:", error);
      return { error: 'Error al procesar la publicación. Asegúrese de que el JSON sea válido.' };
    }
  }

  /**
   * Endpoint to delete a publication.
   * @param id - The ID of the publication to delete.
   * @returns The result of the delete operation.
   */
  @Delete('/delete')
  deletePublication(@Body() id: { id: number }) {
    return this.PublicationService.deletePublication(id.id);
  }

  /**
   * Endpoint to get an array of publications by their IDs.
   * @param idArray - An array of publication IDs.
   * @returns The publications corresponding to the given IDs.
   */
  @Get('/getPublications/array')
  getPublicationsArr(@Body() idArray: { idArray: Array<number> }) {
    return this.PublicationService.getPublicationsArr(idArray.idArray);
  }

  /**
   * Endpoint to get a single publication by its ID.
   * @param id - The ID of the publication to retrieve.
   * @returns The publication corresponding to the given ID.
   */
  @Get('/getPublication')
  getPublication(@Body() id: { id: number }) {
    return this.PublicationService.getPublication(id.id);
  }

  /**
   * Endpoint to generate and retrieve a PDF of publications.
   * @param res - The response object to send the PDF file.
   * @returns The PDF file of publications.
   */
  @Get('/getPDF')
  async getPDF(@Res() res) {
    const pdf = await this.PublicationService.getPDF();
    return of(res.sendFile(join(process.cwd(), "PDF_generate_Publications_DCI/" + pdf)));
  }
  
}