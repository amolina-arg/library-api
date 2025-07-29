import { Injectable } from '@nestjs/common';
import { SchemaRegistry, SchemaType } from '@kafkajs/confluent-schema-registry';
import { RegisteredSchema } from '@kafkajs/confluent-schema-registry/dist/SchemaRegistry';

@Injectable()
export class SchemaRegistryService {
	private readonly registry: SchemaRegistry;

	constructor() {
		this.registry = new SchemaRegistry({ host: 'http://localhost:8081' }); // Replace with your Schema Registry URL
	}

	async getSchema(subject: number) {
		return this.registry.getSchema(subject);
	}

	async registerSchema(schema: string): Promise<RegisteredSchema> {
		return this.registry.register({
			type: SchemaType.AVRO,
			schema: schema,
		});
	}

	async encode(schema: number, payload: any) {
		return this.registry.encode(schema, payload);
	}
}
