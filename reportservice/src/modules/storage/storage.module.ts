// src/modules/storage/storage.module.ts
import { Module } from '@nestjs/common';
import { MegaStorageService } from './mega-storage.service';

@Module({
  providers: [MegaStorageService],
  exports: [MegaStorageService],
})
export class StorageModule {}
