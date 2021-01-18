import { Module } from "@nestjs/common";

import { AccountModule } from "@/modules/account.module";
import { YoutubeModule } from "@/modules/youtube.module";
import { TaskService } from "@/services/task.service";

@Module({
  imports: [AccountModule, YoutubeModule],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
