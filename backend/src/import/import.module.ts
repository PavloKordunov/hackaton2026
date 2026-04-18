import { Module } from '@nestjs/common';
import { ImportController } from './import.controller';
import { ImportService } from './import.service';
import { LandNormalizerService } from './normalizers/land-normalizer.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [ImportController],
  providers: [ImportService, LandNormalizerService, PrismaService],
  exports: [ImportService],
})
export class ImportModule {}
