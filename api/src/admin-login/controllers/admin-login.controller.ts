import {Body,Controller,Get,Param,Post,Delete,Put, UseGuards, Query,} from '@nestjs/common';
import { Observable, catchError, map, of } from 'rxjs';
import { User } from '../models/user.interface';
import { AdminLoginService } from '../services/admin-login.service';

@Controller('users')
export class AdminLoginController {
  constructor(private userService: AdminLoginService) {}

  @Post()
  create(@Body() user: User): Observable<User | Object> {
    return this.userService.create(user).pipe(
      map((user: User) => user),
      catchError((err) => of({ error: err.message })),
    );
  }

@Post('login')
login(@Body() user: User): Observable<Object> {
    return this.userService.login(user).pipe(
        map((jwt: string) => {
            return { access_token: jwt };
        })
    )
}
    @Get(':id') // Route for findOne
    findOne(@Param() params): Observable<User> {
      return this.userService.findOne(params.id);
    }
    
  @Get() // Route for findAll
  findAll(): Observable<User[]> {
    return this.userService.findAll();
  }

  @Delete(':id')
  deleteOne(@Param('id') id: string): Observable<any> {
    return this.userService.deleteOne(Number(id));
  }

  @Put(':id')
  updateOne(@Param('id') id: string, @Body() user: User): Observable<any> {
    return this.userService.updateOne(Number(id), user);
  }
}