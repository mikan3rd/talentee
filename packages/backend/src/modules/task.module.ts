import { Module } from "@nestjs/common";

import { TaskService } from "@/services/task.service";

@Module({
  providers: [TaskService],
})
export class TaskModule {}
