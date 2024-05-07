import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { _dbadmin } from '../models/user.entity';
import { Repository } from 'typeorm';
import { User } from '../models/user.interface';
import { Observable, catchError, from, map, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/auth/service/auth.service';

@Injectable()
export class AdminLoginService {
  [x: string]: any;
  constructor(
    @InjectRepository(_dbadmin)
    private readonly userRepository: Repository<_dbadmin>,
    private authService: AuthService,
  ) {}

  create(user: User): Observable<User> {
    return this.authService.hashPassword(user.password).pipe(
      switchMap((passwordHash: string) => {
        const newUser = new _dbadmin();
        newUser.username = user.username;
        newUser.password = passwordHash;
        newUser.role = user.role;

        return from(this.userRepository.save(newUser)).pipe(
          map((user: User) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...result } = user;
            return result;
          }),
          catchError((err) => throwError(err)),
        );
      }),
    );
  }

  findOne(id: number): Observable<User> {
    return from(this.userRepository.findOne({ where: { id } })).pipe(
      map((user: User) => {
        // console.log(user);
        const { password, ...result } = user;
        return result;
      }),
    );
  }

  findAll(): Observable<User[]> {
    return from(this.userRepository.find()).pipe(
      map((users: User[]) => {
        users.forEach(function (v) {
          delete v.password;
        });
        return users;
      }),
    );
  }

  deleteOne(id: number): Observable<any> {
    return from(this.userRepository.delete(id));
  }
  
  updateOne(id: number, user: User): Observable<any> {
    delete user.password;
    return from(this.userRepository.update(id, user)).pipe(
      switchMap(() => this.findOne(id)),
    );
  }

  login(user: User): Observable<string | any> {
    return this.validateUser(user.username, user.password).pipe(
      switchMap((user: User) => {
        if (user) {
          return this.authService.generateJWT(user).pipe(
            map((jwt: string) => jwt),
            catchError((error) => {
              return throwError('Error generating JWT');
            })
          );
        } else {
          // Return an error message if user credentials are incorrect
          return throwError('Wrong Credentials');
        }
      }),
      catchError((error) => {
        // Handle any unexpected errors
        return throwError('Login failed');
      })
    );
  }

  validateUser(username: string, password: string): Observable<User> {
    return this.findbyusername(username).pipe(
      switchMap((user: User) =>
        this.authService.comparePassword(password, user.password).pipe(
          map((match: boolean) => {
            if (match) {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { password, ...result } = user;
              return result;
            } else {
              throw Error;}
          }),
        ),
      ),
    );
  }

  findbyusername(username: string): Observable<User> {
    return from(this.userRepository.findOne({ where: { username } }));

  }
}