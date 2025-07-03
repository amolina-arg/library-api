import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import { userProviders } from './repositories/users.providers';

@Module({
    providers: [...databaseProviders, ...userProviders],
    exports: [...databaseProviders, ...userProviders],
})
export class DatabaseModule { }
