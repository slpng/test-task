import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
    imports: [
        ClientsModule.register([
            {
                name: "TASK_QUEUE",
                transport: Transport.RMQ,
                options: {
                    urls: [process.env.RABBIT_URL || "amqp://localhost:5672"],
                    queue: "tasks_queue",
                    queueOptions: { durable: true },
                },
            },
        ]),
    ],
    exports: [ClientsModule],
})
export class RabbitmqModule {}
