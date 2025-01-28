import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Publication } from './publication.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // Relación muchos a muchos con Publication
  @ManyToMany(() => Publication, (publication) => publication.tags)
  publications: Publication[];
}