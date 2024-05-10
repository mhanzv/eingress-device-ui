import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Observable, from, map, switchMap,mergeMap, throwError, catchError } from 'rxjs';
import { Employee } from '../models/employee.interface';
import { _dbemployee } from '../models/employee.entity';
import { _dbaccesslog } from '../../access-log/models/access-log.entity';  // Update this import path
import { AccessLogService } from 'src/access-log/services/access-log.service';
import { register } from 'module';

@Injectable()
export class EmployeeService {
    constructor(
        @InjectRepository(_dbemployee)
        private readonly userRepository: Repository<_dbemployee>,
        private readonly accessLogService: AccessLogService,
        @InjectRepository(_dbaccesslog)
        private readonly accessLogRepository: Repository<_dbaccesslog>,
    ) {}

//     create(employee: Employee, file: Express.Multer.File): Observable<Employee> {
//       // Check if the file is provided
//       if (!file) {
//           throw new BadRequestException('No file uploaded');
//       }

//       // Save the file to disk
//       const profileImage = file.filename;

//       // Set the profile image in the employee data
//       employee.profileImage = profileImage;

//       // Save the employee data
//       return from(this.userRepository.save(employee));
//   }

create(employee: Employee): Observable<Employee> {
  
  console.log('EMPLOYEE FINAL VALUE ', employee)
    // Save the employee data
    if (!employee.lastlogdate) {
      employee.lastlogdate = '';
    }
    return from(this.userRepository.save(employee));
   
}

    findOne(id: number): Observable<Employee> {
        return from(this.userRepository.findOne({ where: { id } }));
    }

    findAll(): Observable<Employee[]> {
        return from(this.userRepository.find({relations:['accessLogs']}));
    }

    findByRfidTag(rfidtag: string): Observable<number | null> {
      return from(this.userRepository.findOne({ where: { rfidtag }, select: ['id'] })).pipe(
        map(employee => employee ? employee.id : null),
      );
    }
    
    logEmployeeAccess(rfidTag: string): Observable<any> {
        // console.log(rfidTag);
        return from(this.userRepository.findOne({ where: { rfidtag: rfidTag } })).pipe(
            switchMap(employee => {
                if (!employee) {
                    throw new BadRequestException('Employee not found');
                }

                // Update the last login date for the employee
                const currentDate = new Date();
                const options: Intl.DateTimeFormatOptions = {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false, // Use 24-hour format
                    timeZone: 'Asia/Manila' // Set the time zone to Philippine time
                };
                const dateAndTimeInPhilippineTime = currentDate.toLocaleString('en-PH', options);
                employee.lastlogdate = dateAndTimeInPhilippineTime;

                // Save the updated employee
                return from(this.userRepository.save(employee)).pipe(
                    switchMap(() => {
                        // Log the access in AccessLogService
                        // console.log(rfidTag, "This is wrong");
                        return this.accessLogService.logAccess(rfidTag).pipe(
                            map(() => ({ fullname: employee.fullname, role: employee.role }))
                          );
                    })
                );
            }),
            catchError(error => {
                if (error instanceof BadRequestException) {
                    // Handle employee not found error here
                    console.error('Employee not found:', error.message);
                }
                // Propagate the error
                return throwError(error);
            })
        );
    }
  
     
      getOnlyDate(datetime: string): string {
        const date = new Date(datetime);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
      
        return `${year}-${month}-${day}`;
      }
      
    
    
    deleteOne(id: number): Observable<any> {
        return from(this.userRepository.delete(id));
    }

    deleteEmployeeWithAccessLogs(id: number): Observable<any> {
      return from(this.userRepository.findOne({ where: { id } })).pipe(
          switchMap(user => {
              if (!user) {
                  throw new BadRequestException('User not found');
              }
              // Delete associated access logs
              return from(this.accessLogRepository.delete({ employee: user }));
          }),
          switchMap(() => this.userRepository.delete(id)) // Delete the user
      );
  }

  
    updateOne(id: number, employee: Employee): Observable<Employee> {
        return from(this.userRepository.update(id, employee)).pipe(
            switchMap(() => this.findOne(id))
        );
    }

    countEmployees(): Observable<number> {
      return from(this.userRepository.count());
  }

}

