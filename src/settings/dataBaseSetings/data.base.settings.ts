import { IsOptional, IsString } from 'class-validator';
import { EnvironmentVariable } from '../configurations';

export class DataBaseSettings {
  constructor(private environmentVariables: EnvironmentVariable) {}
  @IsString()
  SQL_HOST: string = this.environmentVariables.SQL_HOST;
  @IsOptional()
  @IsString()
  SQL_USERNAME: string = this.environmentVariables.SQL_USERNAME;
  @IsOptional()
  @IsString()
  SQL_PASS: string = this.environmentVariables.SQL_PASS;
  @IsOptional()
  @IsString()
  SQL_DATABASE: string = this.environmentVariables.SQL_DATABASE;
}
