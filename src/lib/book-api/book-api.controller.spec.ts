import { BooksService } from '../book/books.service';
import { BooksApiController } from './book-api.controller';
import { Book } from '../db/entities/book.entity';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('BookApiController', () => {
	let bookApiController: BooksApiController;
	let bookApiService: BooksService;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			controllers: [BooksApiController],
			providers: [
				BooksService,
				{
					provide: ConfigService,
					useValue: {
						get: jest.fn(key => {
							// Puedes retornar valores simulados aquí
							if (key === 'JWT_SECRET') return 'mockSecret';
							return null;
						}),
					},
				},

				{
					provide: JwtService,
					useValue: {
						sign: jest.fn(),
					},
				},
				{
					provide: getRepositoryToken(Book),
					useValue: {
						find: jest.fn(),
					},
				},
			],
		}).compile();

		bookApiService = moduleRef.get(BooksService);
		bookApiController = moduleRef.get(BooksApiController);
	});

	describe('findAll', () => {
		it('should return an empty array of books', async () => {
			const result: Book[] = [];
			jest
				.spyOn(bookApiService, 'findAll')
				// eslint-disable-next-line @typescript-eslint/require-await
				.mockImplementation(async () => result);

			expect(await bookApiController.findAll()).toBe(result);
		});
	});
});
