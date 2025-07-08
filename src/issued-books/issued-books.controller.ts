import { Controller, UseGuards } from '@nestjs/common';
import { IssuedBooksService } from './issued-books.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('issued-books')
@UseGuards(AuthGuard)
export class IssuedBooksController {
	constructor(private readonly issuedBooksService: IssuedBooksService) {}
}
