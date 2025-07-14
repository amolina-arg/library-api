import { Module } from '@nestjs/common';
import { IssuedBookModule } from '../issued-book/issued-book.module';
import { IssuedBookApiController } from './issued-book-api.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
	imports: [IssuedBookModule, AuthModule],
	controllers: [IssuedBookApiController],
})
export class IssuedBookApiModule {}
