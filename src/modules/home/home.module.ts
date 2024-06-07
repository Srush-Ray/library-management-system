import { Module, forwardRef } from '@nestjs/common';
import { HomeController } from './home.controller';
import { CoreModule } from 'src/core-module/core-module';
import { ReadFileToDatabase } from './services/read-file-init-db';
import { GetBookReturnDetailsByName } from './services/get-book-return-details';
import { GetBookReturnFees } from './services/get-books-fees';

@Module({
  imports: [forwardRef(() => CoreModule)],
  exports: [ReadFileToDatabase, GetBookReturnDetailsByName, GetBookReturnFees],
  providers: [
    ReadFileToDatabase,
    GetBookReturnDetailsByName,
    GetBookReturnFees,
  ],
  controllers: [HomeController],
})
export class HomeModule {}
