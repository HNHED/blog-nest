import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService], // 必须导出，别人才能用
})
export class PrismaModule {}