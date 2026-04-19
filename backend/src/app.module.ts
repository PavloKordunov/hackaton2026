import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ImportModule } from './import/import.module';
import { CommunitiesModule } from './communities/communities.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [ImportModule, CommunitiesModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
