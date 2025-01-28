import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BloggersModule } from './bloggers/bloggers.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [BloggersModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
