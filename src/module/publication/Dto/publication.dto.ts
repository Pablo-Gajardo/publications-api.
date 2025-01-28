export interface PublicationDto {
    title: string;
    description: string;
    image: string;
    publicationDate: Date;
    startDate: Date;
    endDate: Date;
    modificationDate: Date;
    status: boolean; 
    nameTeacher: string;
    IdTeacher: number;
    tags: number[];
}
