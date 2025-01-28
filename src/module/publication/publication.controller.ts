import { Controller, Post, Get, Delete, Body } from '@nestjs/common';
import { PublicationService } from './publication.service';
import { PublicationDto } from './Dto/publication.dto';


@Controller('/publication')
export class PublicationController {
    constructor(private readonly PublicationService:PublicationService) {}

    @Get('/')
    getstate(){
        return 'Publicaciones online';
    }

    @Post('/create')
    createPublication(@Body() publication:PublicationDto){
        return this.PublicationService.createPublication(publication);
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

    @Delete('/deletePublication')
    deletePublication(@Body() id:{id:number}){
        return this.PublicationService.deletePublication(id.id);
    }

    @Post('/getPublications/array')
    getPublicationsArr(@Body() idArray:{idArray:Array<number>}){
        return this.PublicationService.getPublicationsArr(idArray.idArray);
    }

}
