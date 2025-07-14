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
	ValidationPipe,
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { RolesGuard } from 'src/guards/role.guard';
import { BooksService } from '../book/books.service';

@Controller('books')
@UseGuards(AuthGuard, RolesGuard)
export class BooksApiController {
	constructor(private readonly booksService: BooksService) {}

	@Post()
	create(@Body(new ValidationPipe()) createBookDto: CreateBookDto) {
		return this.booksService.create(createBookDto);
	}

	@Get()
	findAll() {
		return this.booksService.findAll();
	}

	@Get('available')
	findAvailable() {
		return this.booksService.findAvailable();
	}

	@Roles(Role.Admin)
	@Get(':id')
	findOne(@Param('id', ParseUUIDPipe) id: string) {
		return this.booksService.findOne(id);
	}

	@Patch(':id')
	update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body(new ValidationPipe()) updateBookDto: UpdateBookDto,
	) {
		return this.booksService.update(id, updateBookDto);
	}

	@Delete(':id')
	remove(@Param('id', ParseUUIDPipe) id: string) {
		return this.booksService.remove(id);
	}
}
