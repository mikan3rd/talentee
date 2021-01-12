import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  @Cron("0 * * * * *")
  handleCron() {
    this.logger.debug("Called when the second is 0");
  }
}
