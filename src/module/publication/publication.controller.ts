import { Controller, Post, Get, Delete, Body } from '@nestjs/common';
import { PublicationService } from './publication.service';
import { PublicationDto } from './Dto/publication.dto';


@Controller('/publication')
export class PublicationController {
    constructor(private PublicationService:PublicationService) {}

    @Get('/')
    getstate(){
        return 'Publicaciones online';
    }

    @Post('/create')
    createPublication(@Body() newPublication:PublicationDto){
        return this.PublicationService.createPublication(newPublication);
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
    setPublication(@Body() id:{id:number},@Body() publication:{publication:PublicationDto}){
        return this.PublicationService.setPublication(id.id, publication.publication);
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

}
