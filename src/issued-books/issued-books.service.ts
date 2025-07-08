import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { IssuedBook } from './entities/issued-book.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class IssuedBooksService {
	constructor(
		@InjectRepository(IssuedBook)
		private readonly issuedBooksRepository: Repository<IssuedBook>,
	) {}

	findAll() {
		return this.issuedBooksRepository.find();
	}
}
