import { NestFactory } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();
declare const module: any;
console.log('JWT_SECRET in main.ts:', process.env.JWT_SECRET);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
  // app.useGlobalGuards(AuthGuard('jwt'));
  app.enableCors();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();