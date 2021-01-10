import { NestFactory } from "@nestjs/core";
import * as morgan from "morgan";

import { AppModule } from "@/modules/app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(morgan("dev"));
  app.enableCors();
  await app.listen(process.env.PORT || 3300);
}
bootstrap();
