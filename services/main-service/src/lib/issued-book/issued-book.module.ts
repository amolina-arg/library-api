import { Module } from '@nestjs/common';
import { IssuedBooksService } from './issued-book.service';
import { IssuedBook } from '../db/entities/issued-book.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Outbox } from '../db/entities/outbox.entity';

@Module({
	providers: [IssuedBooksService],
	imports: [TypeOrmModule.forFeature([IssuedBook, Outbox]), AuthModule],
	exports: [IssuedBooksService],
})
export class IssuedBookModule {}
