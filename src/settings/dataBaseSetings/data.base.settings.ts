import { IsOptional, IsString } from 'class-validator';
import { EnvironmentVariable } from '../configurations';

export class DataBaseSettings {
  constructor(private environmentVariables: EnvironmentVariable) {}
  @IsOptional()
  SQL_HOST = this.environmentVariables.SQL_HOST;
  @IsOptional()
  @IsString()
  SQL_USERNAME: string | undefined = this.environmentVariables.SQL_USERNAME;
  @IsString()
  SQL_PASS: string | undefined = this.environmentVariables.SQL_USERNAME;
}
