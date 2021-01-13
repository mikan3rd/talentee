import { Module } from "@nestjs/common";

import { YoutubeModule } from "@/modules/youtube.module";
import { TaskService } from "@/services/task.service";

@Module({
  imports: [YoutubeModule],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
