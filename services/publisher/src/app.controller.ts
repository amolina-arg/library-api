import { Controller, Inject } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(@Inject('KAFKA_SERVICE') private readonly client: ClientKafka) {}

  @MessagePattern('example-topic')
  handleMessage(@Payload() message: any) {
    console.log('Mensaje:', message);
    return 'Message received from Kafka';
  }
}
