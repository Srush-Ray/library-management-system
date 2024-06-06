import { forwardRef, Module } from '@nestjs/common';
import { CoreModule } from 'src/core-module/core-module';
import { LibraryRepositoryModule } from './library-repository/library-repository-module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    forwardRef(() => CoreModule),
    ConfigModule,
    LibraryRepositoryModule,
  ],
  providers: [],
  exports: [LibraryRepositoryModule],
})
export class RepositoryModule {}
