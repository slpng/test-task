import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TasksModule } from "./tasks/tasks.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleModule } from "@nestjs/schedule";
import { databaseConfig } from "src/config/database.config";
import { ProducerModule } from "./producer/producer.module";
import { WorkerModule } from "./worker/worker.module";

@Module({
    imports: [
        MongooseModule.forRootAsync(databaseConfig.asProvider()),
        ScheduleModule.forRoot(),
        TasksModule,
        ProducerModule,
        WorkerModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
