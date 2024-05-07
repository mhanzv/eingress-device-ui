import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { config } from './orm.config';
import { AuthModule } from './auth/auth.module';
import { AdminLoginModule } from './admin-login/admin-login.module';
import { EmployeeListModule } from './employee-list/employee-list.module';
import { AccessLogModule } from './access-log/access-log.module';


@Module({
  // imports: [TypeOrmModule.forRoot(config)],
  // controllers: [AppController],
  // providers: [AppService],

  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      url: process.env.POSTGRES_URL,
    // port: parseInt(<string>process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    AdminLoginModule,
    AuthModule,
    EmployeeListModule,
    AccessLogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}