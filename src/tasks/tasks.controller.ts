import { Controller, Post } from "@nestjs/common";
import { TasksService } from "src/tasks/tasks.service";

@Controller("tasks")
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @Post()
    async seedTasks() {
        await this.tasksService.seedTasks(5);
    }
}
