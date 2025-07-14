import { Module } from '@nestjs/common';
import { IssuedBooksService } from './issued-book.service';
import { IssuedBook } from '../db/entities/issued-book.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	providers: [IssuedBooksService],
	imports: [TypeOrmModule.forFeature([IssuedBook])],
	exports: [IssuedBooksService],
})
export class IssuedBookModule {}
