import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSettings } from './settings/app.settings';
import { ConfigurationType } from './settings/configurations';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  appSettings(app);
  const configService = app.get(ConfigService<ConfigurationType, true>);
  const apiSettings = configService.get('apiSettings', { infer: true });
  const port = apiSettings.PORT;
  console.log(port);
  await app.listen(3000);
}
bootstrap();
