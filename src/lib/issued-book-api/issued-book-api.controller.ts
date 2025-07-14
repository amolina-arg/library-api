import {
	Body,
	Controller,
	Get,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	Request,
	UseGuards,
	ValidationPipe,
} from '@nestjs/common';
import { IssuedBooksService } from '../issued-book/issued-book.service';
import { AuthGuard } from 'src/lib/auth/guards/auth.guard';
import { CreateIssuedBookDto } from './dto/create-issued-book.dto';
import { Role } from '../auth/enums/role.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/role.guard';
import { UserToken } from '../auth/models/UserToken.model';

@Controller('issued-books')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.Client)
export class IssuedBookApiController {
	constructor(private readonly issuedBooksService: IssuedBooksService) {}

	@Roles(Role.Admin)
	@Get()
	findAll() {
		return this.issuedBooksService.findAll();
	}

	@Get('my-issued-books')
	findMyIssuedBooks(@Request() { user }: { user: UserToken }) {
		return this.issuedBooksService.findMyIssuedBooks(user.sub);
	}

	@Roles(Role.Admin)
	@Get('user/:userId')
	findByUserId(@Param('userId', ParseUUIDPipe) userId: string) {
		return this.issuedBooksService.findByUserId(userId);
	}

	@Roles(Role.Admin)
	@Get('book/:bookId')
	findByBookId(@Param('bookId', ParseUUIDPipe) bookId: string) {
		return this.issuedBooksService.findByBookId(bookId);
	}

	@Get(':id')
	findOne(@Param('id', ParseUUIDPipe) id: string) {
		return this.issuedBooksService.findOne(id);
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
