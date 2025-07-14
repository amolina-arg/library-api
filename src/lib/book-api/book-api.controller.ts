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
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from 'src/lib/auth/decorators/roles.decorator';
import { Role } from 'src/lib/auth/enums/role.enum';
import { RolesGuard } from 'src/lib/auth/guards/role.guard';
import { BooksService } from '../book/books.service';

@Controller('books')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.Client)
export class BooksApiController {
	constructor(private readonly booksService: BooksService) {}

	@Roles(Role.Admin)
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

	@Get(':id')
	findOne(@Param('id', ParseUUIDPipe) id: string) {
		return this.booksService.findOne(id);
	}

	@Roles(Role.Admin)
	@Patch(':id')
	update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body(new ValidationPipe()) updateBookDto: UpdateBookDto,
	) {
		return this.booksService.update(id, updateBookDto);
	}

	@Roles(Role.Admin)
	@Delete(':id')
	remove(@Param('id', ParseUUIDPipe) id: string) {
		return this.booksService.remove(id);
	}
}
