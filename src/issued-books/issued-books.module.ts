import { Module } from '@nestjs/common';
import { IssuedBooksService } from './issued-books.service';
import { IssuedBooksController } from './issued-books.controller';
import { AuthModule } from 'src/auth/auth.module';
import { IssuedBook } from './entities/issued-book.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	controllers: [IssuedBooksController],
	providers: [IssuedBooksService],
	imports: [TypeOrmModule.forFeature([IssuedBook]), AuthModule],
})
export class IssuedBooksModule {}
