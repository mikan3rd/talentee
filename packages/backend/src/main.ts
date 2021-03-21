import { NestFactory } from "@nestjs/core";
import * as Sentry from "@sentry/node";
import dayjs from "dayjs";
import admin from "firebase-admin";
import morgan from "morgan";
import "dayjs/locale/ja";

import { SentryInterceptor } from "@/interceptors/sentry.interceptor";
import { AppModule } from "@/modules/app.module";

dayjs.locale("ja");

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // https://stackoverflow.com/a/41044630/1332513
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["debug", "warn", "error"],
  });

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.SENTRY_ENV,
    tracesSampleRate: 1.0,
  });
  app.useGlobalInterceptors(new SentryInterceptor());

  // https://github.com/expressjs/morgan/issues/116#issuecomment-240242129
  morgan.token("graphql-query", (req) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { body } = req;

    if (!body) {
      return;
    }

    const { operationName, variables } = body;
    if (operationName) {
      return `\nOperation Name: ${operationName}\nVariables: ${JSON.stringify(variables)}`;
    }
    return;
  });
  app.use(morgan(":method :url :status :response-time ms :graphql-query"));

  app.enableCors();
  const server = await app.listen(process.env.PORT || 3300);
  if (process.env.HTTPS_TIMEOUT) {
    server.setTimeout(1000 * 60 * Number(process.env.HTTPS_TIMEOUT));
  }
}

bootstrap();
