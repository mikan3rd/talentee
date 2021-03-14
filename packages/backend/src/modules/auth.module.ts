import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";

import { AuthService } from "@/services/auth.service";
import { PrismaService } from "@/services/prisma.service";
import { FirebaseAuthStrategy } from "@/strategies/firebaseAuth.strategy";

@Module({
  imports: [PassportModule],
  providers: [AuthService, PrismaService, FirebaseAuthStrategy],
  exports: [AuthService],
})
export class AuthModule {}
