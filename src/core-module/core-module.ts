import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { HomeModule } from 'src/modules/home/home.module';
import { RepositoryModule } from 'src/repository/repository-module';

@Module({
  imports: [
    HomeModule,
    MulterModule.register({
      dest: 'src/uploads/csv',
    }),
    RepositoryModule,
  ],
  providers: [],
  exports: [RepositoryModule, HomeModule],
})
export class CoreModule {}
