import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../../users/domain/user.entity';
import { Blog } from '../../bloggers/domain/blog.entity';

@Injectable()
export class TestingRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(User) protected usersRepository: Repository<User>,
    @InjectRepository(Blog) protected blogsRepository: Repository<Blog>,
  ) {}

  async deleteAll(): Promise<boolean> {
    try {
      // await this.dataSource.query(`DELETE FROM public."users"`);
      // await this.dataSource.query(`DELETE FROM public."blogs"`);
      await this.usersRepository.delete({});
      await this.blogsRepository.delete({});
      return true;
    } catch (e) {
      console.log(e);
      return true;
    }
  }
}
