// src/modules/storage/mega-storage.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Storage } from 'megajs';
import { loadEnv } from '../../env/env.loader';

@Injectable()
export class MegaStorageService {
  private readonly logger = new Logger(MegaStorageService.name);
  private storagePromise: Promise<any> | null = null;

  constructor() {
    const env = loadEnv();
    if (env.MEGA_EMAIL && env.MEGA_PASSWORD) {
      const storage = new Storage({
        email: env.MEGA_EMAIL,
        password: env.MEGA_PASSWORD,
      });
      this.storagePromise = new Promise((resolve, reject) => {
        storage.on('ready', () => resolve(storage));
        // 'error' event is not supported on Storage, so we remove this line.
      });
    } else {
      this.logger.warn(
        'MEGA_EMAIL / MEGA_PASSWORD not set – uploads will fail.',
      );
    }
  }

  async uploadReport(filename: string, buffer: Buffer): Promise<string> {
    if (!this.storagePromise) {
      throw new Error('MEGA storage not configured');
    }
    const storage = await this.storagePromise;

    const file = storage.upload({ name: filename, data: buffer });
    const uploaded = await new Promise<any>((resolve, reject) => {
      file.on('complete', resolve);
      file.on('error', reject);
    });

    return uploaded.link(); // public download link
  }
}
