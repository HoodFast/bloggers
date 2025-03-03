import { ConfigService } from '@nestjs/config';
import { ValidateNested, validateSync } from 'class-validator';
import { ApiSettings } from './apiSettings/api.settings';
import { DataBaseSettings } from './dataBaseSetings/data.base.settings';
import { JwtSettings } from './jwtSettings/jwt.settings';
require('dotenv').config();

export type EnvironmentVariable = { [key: string]: string };

export type ConfigurationType = ReturnType<typeof Configuration.createConfig>;
export type ConfigServiceType = ConfigService<ConfigurationType>;

export class Configuration {
  @ValidateNested()
  apiSettings: ApiSettings;
  @ValidateNested()
  dataBaseSettings: DataBaseSettings;
  @ValidateNested()
  jwtSettings: JwtSettings;

  private constructor(configuration: Configuration) {
    Object.assign(this, configuration);
  }
  static createConfig(
    environmentVariables: Record<string, string>,
  ): Configuration {
    return new this({
      apiSettings: new ApiSettings(environmentVariables),
      dataBaseSettings: new DataBaseSettings(environmentVariables),
      jwtSettings: new JwtSettings(environmentVariables),
    });
  }
}

export function validate(environmentVariables: Record<string, string>) {
  const config = Configuration.createConfig(environmentVariables);

  const errors = validateSync(config, { skipMissingProperties: false });
  if (errors.length > 0) throw new Error(errors.toString());
  return config;
}
export default () => {
  const environmentVariables = process.env as EnvironmentVariable;
  return Configuration.createConfig(environmentVariables);
};
