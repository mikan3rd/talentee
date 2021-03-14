import { Injectable, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import admin from "firebase-admin";
import { ExtractJwt } from "passport-jwt";
import { Strategy } from "passport-strategy";

import { AuthService } from "@/services/auth.service";

const UNAUTHORIZED = "Unauthorized";
const BADREQUEST = "BadRequest";

type FirebaseUser = admin.auth.DecodedIdToken;

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(Strategy, "firebase") {
  private readonly logger = new Logger(FirebaseAuthStrategy.name);
  readonly name = "firebase";
  private extractor = ExtractJwt.fromAuthHeaderAsBearerToken();
  private checkRevoked = false;

  constructor(private authService: AuthService) {
    super();
  }

  async authenticate(req: Request) {
    const idToken = this.extractor(req);

    if (!idToken) {
      this.fail(UNAUTHORIZED, 401);
      return;
    }

    try {
      const res = await admin.auth().verifyIdToken(idToken, this.checkRevoked);
      await this.validateDecodedIdToken(res);
    } catch (e) {
      this.logger.error(e);
      this.fail(e, 401);
    }
  }

  private async validateDecodedIdToken(decodedIdToken: FirebaseUser) {
    const { uid, name, email } = decodedIdToken;

    if (!email) {
      this.fail(BADREQUEST, 400);
      return;
    }

    const user = await this.authService.upsertUser({ uid, name, email });

    if (user) {
      this.success(user);
      return;
    }

    this.fail(UNAUTHORIZED, 401);
  }
}
