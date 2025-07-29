import { Module } from '@nestjs/common';
import { IssuedBooksService } from './issued-book.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Outbox } from '../db/entities/outbox.entity';
import { IssuedBook } from 'src/db/entities/issued-book.entity';

@Module({
	providers: [IssuedBooksService],
	imports: [TypeOrmModule.forFeature([IssuedBook, Outbox])],
	exports: [IssuedBooksService],
})
export class IssuedBookModule {}
