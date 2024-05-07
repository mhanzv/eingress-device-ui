import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable, from, of } from 'rxjs';
import { User } from 'src/admin-login/models/user.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  constructor(private readonly jwtService: JwtService) {}

  generateJWT(user: User): Observable<string> {
    return from(this.jwtService.signAsync({ user }));
  }

  hashPassword(password: string): Observable<string> {
    return from(bcrypt.hash(password, 12));
  }

  comparePassword(password: string, hashedPassword: string): Observable<boolean> {
    return from(bcrypt.compare(password, hashedPassword));
  }
  
}
