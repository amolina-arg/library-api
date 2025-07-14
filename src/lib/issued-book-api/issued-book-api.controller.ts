import {
	Body,
	Controller,
	Get,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	UseGuards,
	ValidationPipe,
} from '@nestjs/common';
import { IssuedBooksService } from '../issued-book/issued-book.service';
import { AuthGuard } from 'src/lib/auth/guards/auth.guard';
import { CreateIssuedBookDto } from './dto/create-issued-book.dto';

@Controller('issued-books')
@UseGuards(AuthGuard)
export class IssuedBookApiController {
	constructor(private readonly issuedBooksService: IssuedBooksService) {}

	@Get()
	findAll() {
		return this.issuedBooksService.findAll();
	}

	@Post()
	create(@Body(new ValidationPipe()) createIssuedBookDto: CreateIssuedBookDto) {
		return this.issuedBooksService.create(createIssuedBookDto);
	}

	@Patch(':id/return')
	returnBook(@Param('id', ParseUUIDPipe) id: string) {
		return this.issuedBooksService.returnBook(id);
	}
}
