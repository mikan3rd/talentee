import { Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import admin from "firebase-admin";
import { ExtractJwt } from "passport-jwt";
import { Strategy } from "passport-strategy";

const UNAUTHORIZED = "Unauthorized";

type FirebaseUser = admin.auth.DecodedIdToken;

export class FirebaseAuthStrategy extends PassportStrategy(Strategy, "firebase") {
  private readonly logger = new Logger(FirebaseAuthStrategy.name);
  readonly name = "firebase";
  private extractor = ExtractJwt.fromAuthHeaderAsBearerToken();
  private checkRevoked = false;

  async validate(payload: FirebaseUser) {
    return payload;
  }

  authenticate(req: Request) {
    const idToken = this.extractor(req);

    if (!idToken) {
      this.fail(UNAUTHORIZED, 401);
      return;
    }

    try {
      admin
        .auth()
        .verifyIdToken(idToken, this.checkRevoked)
        .then((res) => this.validateDecodedIdToken(res))
        .catch((err) => {
          this.fail({ err }, 401);
        });
    } catch (e) {
      this.logger.error(e);
      this.fail(e, 401);
    }
  }

  private async validateDecodedIdToken(decodedIdToken: FirebaseUser) {
    console.log(decodedIdToken);
    const result = await this.validate(decodedIdToken);

    if (result) {
      this.success(result);
    }

    this.fail(UNAUTHORIZED, 401);
  }
}
