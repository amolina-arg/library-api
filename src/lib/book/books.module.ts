import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from '../db/entities/book.entity';

@Module({
	providers: [BooksService],
	exports: [BooksService],
	imports: [TypeOrmModule.forFeature([Book])],
})
export class BooksModule {}
