import type { Request } from 'express';
import type * as DataLoader from 'dataloader';
import type { UserToken } from '../auth/models/UserToken.model';
import type { Book } from '../db/entities/book.entity';

export interface GqlContext {
	req: Request & { user?: UserToken };
	bookDataLoader?: DataLoader<string, Book>;
}
