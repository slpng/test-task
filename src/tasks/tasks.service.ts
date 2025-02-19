import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Task } from "src/tasks/task.schema";

@Injectable()
export class TasksService {
    constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

    #logger = new Logger(TasksService.name);

    #URLS = [
        "https://google.com/",
        "https://youtube.com/",
        "https://x.com/",
        "https://facebook.com/",
        "https://netflix.com/",
        "https://amazon.com/",
        "https://reddit.com/",
        "https://linkedin.com/",
    ];

    async seedTasks(n: number) {
        this.#logger.log(`Inserting ${n} new tasks...`);

        const inserted = await this.taskModel.insertMany(
            Array.from({ length: n }, () => {
                const url =
                    this.#URLS[Math.floor(Math.random() * this.#URLS.length)];

                return {
                    url,
                    status: "NEW",
                    http_code: null,
                };
            }),
        );

        this.#logger.log(`Inserted ${inserted.length} new tasks`);
    }
}
