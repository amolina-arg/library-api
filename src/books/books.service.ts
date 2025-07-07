import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
  ) {}

  create(createBookDto: CreateBookDto) {
    const book = this.booksRepository.create(createBookDto);
    return this.booksRepository.save(book);
  }

  findAll() {
    return this.booksRepository.find();
  }

  findOne(id: string) {
    return this.booksRepository.findOneBy({ id });
  }

  update(id: string, updateBookDto: UpdateBookDto) {
    return this.booksRepository.update(id, updateBookDto);
  }

  remove(id: string) {
    return this.booksRepository.delete(id);
  }
}
