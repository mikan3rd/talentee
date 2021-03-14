import { Module } from "@nestjs/common";

import { AuthService } from "@/services/auth.service";
import { PrismaService } from "@/services/prisma.service";

@Module({
  imports: [],
  providers: [AuthService, PrismaService],
  exports: [AuthService],
})
export class AuthModule {}
