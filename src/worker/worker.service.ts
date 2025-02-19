import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import amqp, { Channel } from "amqp-connection-manager";
import { Model, Types } from "mongoose";
import { Task } from "src/tasks/task.schema";

@Injectable()
export class WorkerService implements OnModuleInit {
    constructor(
        private taskModel: Model<Task>,
        index: number,
    ) {
        this.#logger = new Logger(`${WorkerService.name}-${index}`);
    }

    #logger;

    async onModuleInit() {
        await this.startConsumer();
    }

    async startConsumer() {
        const connection = amqp.connect([
            process.env.RABBIT_URL || "amqp://localhost:5672",
        ]);
        const channelWrapper = connection.createChannel({
            setup: (channel: Channel) => {
                return channel.assertQueue("tasks_queue", { durable: true });
            },
        });

        await channelWrapper.consume("tasks_queue", (msg) => {
            const {
                pattern,
                data: { task },
            } = JSON.parse(msg.content.toString()) as {
                pattern: string;
                data: {
                    task: Task & { _id: Types.ObjectId };
                };
            };

            if (pattern === "process_task") {
                this.#logger.log(
                    `Processing task with _id of ${task._id.toString()}...`,
                );

                this.processSingleTask(task).then(
                    () => {
                        this.#logger.log(
                            `Finished processing task with _id of ${task._id.toString()}`,
                        );
                    },
                    () => {
                        this.#logger.log(
                            `Couldn't process task with _id of ${task._id.toString()}`,
                        );
                    },
                );
            }

            channelWrapper.ack(msg);
        });
    }

    async processSingleTask(task: Task & { _id: Types.ObjectId }) {
        let res: Response;
        let ok: boolean;
        let status: number;

        try {
            res = await fetch(task.url);
            ok = res.ok;
            status = res.status;
        } catch {
            ok = false;
            status = 500;
        }

        return await this.updateTaskStatus(
            task._id.toString(),
            ok ? "DONE" : "ERROR",
            status,
        );
    }

    async updateTaskStatus(
        id: string,
        status: "DONE" | "ERROR",
        httpCode: number,
    ) {
        return await this.taskModel.updateOne(
            { _id: id },
            { $set: { status, http_code: httpCode } },
        );
    }
}
