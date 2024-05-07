import { Test, TestingModule } from '@nestjs/testing';
import { AccessLogController } from './access-log.controller';

describe('AccessLogController', () => {
  let controller: AccessLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccessLogController],
    }).compile();

    controller = module.get<AccessLogController>(AccessLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
