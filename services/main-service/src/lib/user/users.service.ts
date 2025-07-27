import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/lib/db/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {}

	async findAll(): Promise<User[]> {
		return this.userRepository.find();
	}

	async create(user: User): Promise<User> {
		return this.userRepository.save(user);
	}

	async findOneById(id: string): Promise<User | undefined> {
		const user = await this.userRepository.findOne({ where: { id } });
		if (!user) {
			throw new NotFoundException('User not found');
		}
		return user;
	}

	async findOne(username: string): Promise<User | undefined> {
		const user = await this.userRepository.findOne({ where: { username } });
		if (!user) {
			throw new NotFoundException('User not found');
		}
		return user;
	}
}
