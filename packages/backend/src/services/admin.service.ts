import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { PrismaService } from "@/services/prisma.service";
import { UtilsService } from "@/services/utils.service";

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    private utilsService: UtilsService,
    private prisma: PrismaService,
    private configService: ConfigService<EnvironmentVariables>,
  ) {}

  async test() {
    return this.prisma.account.findFirst();
  }
}
