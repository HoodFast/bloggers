import { Module } from '@nestjs/common';
import { User } from '../users/domain/user.entity';
import { TestingController } from './api/testing.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestingRepository } from './infrastructure/testing.repository';
import { Blog } from '../bloggers/domain/blog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Blog])],
  controllers: [TestingController],
  providers: [TestingRepository],
})
export class TestingModule {}
