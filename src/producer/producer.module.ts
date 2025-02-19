import { Module } from "@nestjs/common";
import { ProducerService } from "./producer.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Task, TaskSchema } from "src/tasks/task.schema";
import { RabbitmqModule } from "src/rabbitmq/rabbitmq.module";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
        RabbitmqModule,
    ],
    providers: [ProducerService],
})
export class ProducerModule {}
