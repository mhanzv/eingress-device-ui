import { Module } from '@nestjs/common';
import { AccessLogService } from './services/access-log.service';
import { AccessLogController } from './controllers/access-log.controller';
import { _dbaccesslog } from './models/access-log.entity'; // Assuming the entity file is named access-log.entity.ts
import { TypeOrmModule } from '@nestjs/typeorm';
import { _dbemployee } from 'src/employee-list/models/employee.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([_dbaccesslog,_dbemployee]), // Import the AccessLog entity
  ],
  providers: [AccessLogService],
  exports: [AccessLogService],
  controllers: [AccessLogController]
})
export class AccessLogModule {}
