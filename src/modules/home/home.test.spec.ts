import { Test, TestingModule } from '@nestjs/testing';
import { HomeController } from './home.controller';
import { GetBookReturnDetailsByName } from './services/get-book-return-details';

describe('BookDetailsService', () => {
  let service: GetBookReturnDetailsByName;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HomeController],
      providers: [GetBookReturnDetailsByName],
    }).compile();

    service = module.get<GetBookReturnDetailsByName>(
      GetBookReturnDetailsByName,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
