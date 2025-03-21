import { NestFactory } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();
console.log('JWT_SECRET in main.ts:', process.env.JWT_SECRET);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalGuards(AuthGuard('jwt'));
  await app.listen(process.env.PORT || 3001);
}
bootstrap();