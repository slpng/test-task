import { Module } from "@nestjs/common";
import { WorkerService } from "./worker.service";
import { getModelToken, MongooseModule } from "@nestjs/mongoose";
import { Task, TaskSchema } from "src/tasks/task.schema";
import { Model } from "mongoose";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    ],
    providers: Array(3)
        .fill(null)
        .map((_, index) => ({
            provide: `Worker-${index}`,
            useFactory: (taskModel: Model<Task>) => {
                return new WorkerService(taskModel, index);
            },
            inject: [getModelToken(Task.name)],
        })),
})
export class WorkerModule {}
