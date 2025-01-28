import {Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable} from 'typeorm';
import { Tag } from './tag.entity';


@Entity()
export class Publication {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    title: string;
    @Column()
    description: string;
    @Column()
    image: string;
    @Column({type: Date, default: () => 'CURRENT_TIMESTAMP'})
    publicationDate: Date;
    @Column()
    startDate: Date;
    @Column()
    endDate: Date;
    @Column({type: Date, default: () => 'CURRENT_TIMESTAMP'})
    modificationDate: Date;
    @Column()
    status: boolean; 
    @Column()
    nameTeacher: string;
    @Column()
    IdTeacher: number;
    
    // Relación muchos a muchos con Tag
  @ManyToMany(() => Tag, (tag) => tag.publications, { cascade: true })
  @JoinTable() // Esto crea la tabla intermedia automáticamente
  tags: Tag[];

}