import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
class PublicationTags {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    idPublication: number;
    @Column()
    IdTag: number;
}