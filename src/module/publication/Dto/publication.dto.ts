export interface PublicationDto {
    id: number;
    title: string;
    description: string;
    image: string;
    startDate: Date;
    endDate: Date;
    modificationDate: Date;
    status: boolean; 
    nameTeacher: string;
    IdTeacher: number;
    tags: number[];
}
