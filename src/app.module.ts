import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BloggersModule } from './bloggers/bloggers.module';

@Module({
  imports: [BloggersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
