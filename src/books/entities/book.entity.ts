import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'books' })
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 500 })
  title: string;

  @Column({ length: 500 })
  author: string;

  @Column({ length: 500 })
  isbn: string;
}
