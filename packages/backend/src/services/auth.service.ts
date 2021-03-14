import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { PrismaService } from "@/services/prisma.service";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async upsertUser(data: Prisma.UserCreateInput) {
    return await this.prisma.user.upsert({ where: { uid: data.uid }, create: data, update: data });
  }
}
