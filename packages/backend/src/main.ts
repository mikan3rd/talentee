import { NestFactory } from "@nestjs/core";
import * as Sentry from "@sentry/node";
import * as morgan from "morgan";

import { SentryInterceptor } from "@/interceptors/sentry.interceptor";
import { AppModule } from "@/modules/app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.SENTRY_ENV,
      tracesSampleRate: 1.0,
    });
    app.useGlobalInterceptors(new SentryInterceptor());
  }

  app.use(morgan("dev"));
  app.enableCors();
  await app.listen(process.env.PORT || 3300);
}
bootstrap();
