/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

@InputType()
export class CreateBookInput {
	@IsString()
	@IsNotEmpty()
	@MaxLength(500)
	@Field()
	title: string;

	@IsString()
	@IsNotEmpty()
	@MaxLength(500)
	@Field()
	author: string;

	@IsString()
	@IsNotEmpty()
	@MaxLength(500)
	@Field()
	isbn: string;
}
