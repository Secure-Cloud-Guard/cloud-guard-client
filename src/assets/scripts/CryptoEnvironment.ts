import type { Context } from 'vm';
import type { EnvironmentContext, JestEnvironmentConfig } from '@jest/environment';
import { Crypto } from '@peculiar/webcrypto';
import JsDomEnvironment from 'jest-environment-jsdom';

export class CryptoEnvironment extends JsDomEnvironment {
  constructor({ globalConfig, projectConfig }: JestEnvironmentConfig, context: EnvironmentContext) {
    const pcWithBuffer = {
      ...projectConfig,
      globals: {
        ...projectConfig.globals,
        Uint8Array,
      },
    };

    super({ globalConfig, projectConfig: pcWithBuffer }, context);

    Object.defineProperty(this.global, 'crypto', {
      value: new Crypto(),
    });
  }

  override async setup(): Promise<void> {
    await super.setup();
  }

  override async teardown(): Promise<void> {
    await super.teardown();
  }

  override getVmContext(): Context | null {
    return super.getVmContext();
  }
}

export default CryptoEnvironment;
