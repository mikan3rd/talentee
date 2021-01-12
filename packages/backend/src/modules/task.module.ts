import { Module } from "@nestjs/common";

import { YoutubeModule } from "@/modules/youtube.module";
import { AccountService } from "@/services/account.service";
import { TaskService } from "@/services/task.service";
import { YoutubeService } from "@/services/youtube.service";

@Module({
  imports: [YoutubeModule],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
