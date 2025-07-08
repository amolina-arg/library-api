import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	ParseUUIDPipe,
	UseGuards,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('books')
@UseGuards(AuthGuard)
export class BooksController {
	constructor(private readonly booksService: BooksService) {}

	@Post()
	create(@Body() createBookDto: CreateBookDto) {
		return this.booksService.create(createBookDto);
	}

	@Get()
	findAll() {
		return this.booksService.findAll();
	}

	@Get(':id')
	findOne(@Param('id', ParseUUIDPipe) id: string) {
		return this.booksService.findOne(id);
	}

	@Patch(':id')
	update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateBookDto: UpdateBookDto,
	) {
		return this.booksService.update(id, updateBookDto);
	}

	@Delete(':id')
	remove(@Param('id', ParseUUIDPipe) id: string) {
		return this.booksService.remove(id);
	}
}
