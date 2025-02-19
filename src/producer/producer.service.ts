import { Inject, Injectable, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { InjectModel } from "@nestjs/mongoose";
import { Cron } from "@nestjs/schedule";
import { Model } from "mongoose";
import { Task } from "src/tasks/task.schema";

@Injectable()
export class ProducerService {
    constructor(
        @InjectModel(Task.name) private taskModel: Model<Task>,
        @Inject("TASK_QUEUE") private readonly client: ClientProxy,
    ) {}

    #logger = new Logger(ProducerService.name);

    async getNextTask() {
        return this.taskModel
            .findOneAndUpdate(
                { status: "NEW" },
                { $set: { status: "PROCESSING" } },
                { new: true },
            )
            .exec();
    }

    async getTasksBatch(n: number) {
        const tasks = [];

        for (let i = 0; i < n; i++) {
            const task = await this.getNextTask();
            if (task === null) {
                break;
            }
            tasks.push(task);
        }

        return tasks;
    }

    @Cron("*/5 * * * * *")
    async processTasks() {
        this.#logger.log("Checking for new tasks...");

        const tasks = await this.getTasksBatch(100);
        if (tasks.length > 0) {
            this.#logger.log(
                `Found ${tasks.length} new tasks, posting to queue...`,
            );
            tasks.forEach((task) => {
                this.client.emit("process_task", { task });
            });
        }
    }
}
