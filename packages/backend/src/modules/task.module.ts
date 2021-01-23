import { Module } from "@nestjs/common";

import { AccountModule } from "@/modules/account.module";
import { InstagramModule } from "@/modules/instagram.module";
import { TwitterModule } from "@/modules/twitter.module";
import { YoutubeModule } from "@/modules/youtube.module";
import { TaskService } from "@/services/task.service";

@Module({
  imports: [AccountModule, YoutubeModule, TwitterModule, InstagramModule],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
