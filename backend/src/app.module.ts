import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { MenusModule } from './modules/menus/menus.module';

@Module({
  imports: [PrismaModule, MenusModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
