import { Controller, Post, Get, Delete, Body, UseInterceptors, UploadedFile, UploadedFiles, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Res } from '@nestjs/common';
import { PublicationService } from './publication.service';
import { PublicationDto } from './Dto/publication.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CONFIGURABLE_MODULE_ID } from '@nestjs/common/module-utils/constants';
import { of } from 'rxjs';
import { join } from 'path';



@Controller('/publication')
export class PublicationController {
    constructor(private PublicationService:PublicationService) {}

    @Get('/')
    getstate(){
        return 'Publicaciones online';
    }

    @Post('/create')
    @UseInterceptors(FileInterceptor('image'))
    async CreatePublcation(@UploadedFile(new ParseFilePipe(),)
      image: Express.Multer.File,
      @Body('publication') publicationString: string,
    ) {
      try {
        const publication: PublicationDto = JSON.parse(publicationString); // Parsea el string a objeto
        await this.PublicationService.saveImageAndCreatePublication(image, publication);
        return 'Imagen guardada y publicación creada';
      } catch (error) {
        console.error("Error al procesar la publicación:", error);
        return { error: 'Error al procesar la publicación. Asegúrese de que el JSON sea válido.' }; 
      }
    }
    

    @Post('/changeState')
    changeStatePublication(@Body() id:{id:number}){
        return this.PublicationService.changeStatePublication(id.id);
    }

    @Post('/getTags')
    getTask(){
        return this.PublicationService.getTags();
    }

    @Post('/getPublications')
    getPublications(){
        return this.PublicationService.getPublications();
    }

    @Post('/setPublication')
    @UseInterceptors(FileInterceptor('image'))
    async setPublication(@UploadedFile(new ParseFilePipe(),)
      image: Express.Multer.File,
      @Body('publication') publicationString: string, 
      @Body('id') id: number)
      {
        try {
            const publication: PublicationDto = JSON.parse(publicationString); // Parsea el string a objeto
            await this.PublicationService.setPublication(id, publication, image);
            return 'publicación '+id+' modificada exitosamente';
          } catch (error) {
            console.error("Error al procesar la publicación:", error);
            return { error: 'Error al procesar la publicación. Asegúrese de que el JSON sea válido.' }; 
          }
    }

    @Delete('/delete')
    deletePublication(@Body() id:{id:number}){
        return this.PublicationService.deletePublication(id.id);
    }

    @Post('/getPublications/array')
    getPublicationsArr(@Body() idArray:{idArray:Array<number>}){
        return this.PublicationService.getPublicationsArr(idArray.idArray);
    }

    @Post('/getPublication')
    getPublication(@Body() id:{id:number}){
        return this.PublicationService.getPublication(id.id);
    }

    @Post('/getPDF')
    async getPDF(@Res() res){
        const pdf = await this.PublicationService.getPDF();
        return of(res.sendFile(join(process.cwd(),"PDF_generate_Publications_DCI/"+pdf))); 

    }

}
