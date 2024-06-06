import { Module, forwardRef } from '@nestjs/common';
import { HomeController } from './home.controller';
import { CoreModule } from 'src/core-module/core-module';
import { ReadFileToDatabase } from './services/read-file-init-db';

@Module({
  imports: [forwardRef(() => CoreModule)],
  exports: [ReadFileToDatabase],
  providers: [ReadFileToDatabase],
  controllers: [HomeController],
})
export class HomeModule {}
