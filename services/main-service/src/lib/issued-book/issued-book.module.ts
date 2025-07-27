import { Module } from '@nestjs/common';
import { IssuedBooksService } from './issued-book.service';
import { IssuedBook } from '../db/entities/issued-book.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

@Module({
	providers: [IssuedBooksService],
	imports: [TypeOrmModule.forFeature([IssuedBook]), AuthModule],
	exports: [IssuedBooksService],
})
export class IssuedBookModule {}
