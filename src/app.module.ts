import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration, {
  ConfigServiceType,
  validate,
} from 'src/settings/configurations';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './features/auth/auth.module';
import { BloggersModule } from './features/bloggers/bloggers.module';
import { UsersModule } from './features/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: validate,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigServiceType) => {
        const sqlDataBaseSettings = configService.get('dataBaseSettings', {
          infer: true,
        });
        return {
          type: 'postgres',
          host: sqlDataBaseSettings?.SQL_HOST,
          username: sqlDataBaseSettings?.SQL_USERNAME,
          password: sqlDataBaseSettings?.SQL_PASS,
          database: 'default_db',
          // ssl: true,
          ssl: {
            rejectUnauthorized: false, // Добавлено для игнорирования проверки сертификата
          },
          autoLoadEntities: true,
          synchronize: true,
          port: 5432,
        };
      },
    }),
    AuthModule,
    BloggersModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
