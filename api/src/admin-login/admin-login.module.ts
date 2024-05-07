import { Module } from '@nestjs/common';
import { AdminLoginService } from './services/admin-login.service';
import { AdminLoginController } from './controllers/admin-login.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { _dbadmin } from './models/user.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([_dbadmin]),
    AuthModule
  ],
  providers: [AdminLoginService],
  controllers: [AdminLoginController]
})
export class AdminLoginModule {}