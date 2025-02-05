import { IsOptional, IsString } from 'class-validator';
import { EnvironmentVariable } from '../configurations';

export class JwtSettings {
  constructor(private environmentVariables: EnvironmentVariable) {}
  @IsOptional()
  @IsString()
  AC_SECRET: string = this.environmentVariables.AC_SECRET;
  @IsOptional()
  @IsString()
  AC_TIME: string = this.environmentVariables.AC_TIME;
  @IsOptional()
  @IsString()
  RT_SECRET: string = this.environmentVariables.RT_SECRET;
  @IsOptional()
  @IsString()
  RT_TIME: string = this.environmentVariables.RT_TIME;
}
