import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { _dbaccesslog } from './../../access-log/models/access-log.entity';
import { Observable, catchError, from, map, switchMap, throwError } from 'rxjs';
import { _dbemployee } from 'src/employee-list/models/employee.entity';

@Injectable()
export class AccessLogService {
  constructor(
    @InjectRepository(_dbaccesslog)
    private readonly accessLogRepository: Repository<_dbaccesslog>,
    @InjectRepository(_dbemployee)
    private readonly employeeRepository: Repository<_dbemployee>,
  ) {}

  findAll(): Promise<_dbaccesslog[]> {
    return this.accessLogRepository.find();
  }

  findById(id: number): Promise<_dbaccesslog> {
    return this.accessLogRepository.findOne({where:{id}}).then((accessLog) => {
      if (!accessLog) {
        throw new NotFoundException(`Access log with ID ${id} not found`);
      }
      return accessLog;
    });
  }

  create(accessLogData: Partial<_dbaccesslog>): Promise<_dbaccesslog> {
    const newAccessLog = this.accessLogRepository.create(accessLogData);
    return this.accessLogRepository.save(newAccessLog);
  }

  update(id: number, accessLogData: Partial<_dbaccesslog>): Promise<_dbaccesslog> {
    return this.findById(id).then((accessLog) => {
      this.accessLogRepository.merge(accessLog, accessLogData);
      return this.accessLogRepository.save(accessLog);
    });
  }

  delete(id: number): Promise<any> {
    return this.findById(id).then((accessLog) => {
      return this.accessLogRepository.remove(accessLog);
    });
  }
  
  // logAccess(rfidTag: string, accessType: string, roleAtAccess: string): Observable<void> {
  //   // Find the employee by RFID tag
  //   return from(this.employeeRepository.findOne({ where: { rfidtag: rfidTag } })).pipe(
  //     switchMap(employee => {
  //       if (!employee) {
  //         throw new BadRequestException('Employee not found');
  //       }

  //       // Create a new access log entry
  //       const accessLog: _dbaccesslog = {
  //         employee,
  //         accessDateTime: new Date(),
  //         accessType,
  //         roleAtAccess,
  //         id: 0,
  //       };

  //       // Save the access log
  //       return from(this.accessLogRepository.save(accessLog)).pipe(
  //         map(() => {})
  //       );
  //     })
  //   );
  // }
  
  logAccess(rfidTag: string): Observable<void> {
    return from(this.employeeRepository.findOne({ where: { rfidtag: rfidTag } })).pipe(
      switchMap((employee: _dbemployee) => {
        if (!employee) {
          throw new BadRequestException('Employee not found');
        }

        const accessLogEntry: _dbaccesslog = {
          id: 0, // Provide a default value for id if it's not auto-generated
          rfidtag: employee.rfidtag, // Add rfidtag from employee
          accessDateTime: new Date(),
          accessType: 'In', // or 'Out', depending on the logic
          roleAtAccess: employee.role,
          employee: employee // Include the employee entity
          // Any additional properties you need to include in the access log entry
        };

        return from(this.accessLogRepository.save(accessLogEntry)).pipe(
          catchError((error) => {
            return throwError('Error saving access log');
          }),
          switchMap(() => {
            return from(Promise.resolve()); // Return an empty observable
          })
        );
      }),
      catchError((error) => {
        return throwError('Error finding employee');
      })
    );
  }

  // logAccess(rfidTag: string, accessType?: string, roleAtAccess?: string): Observable<void> {
  //   // Find the employee by RFID tag
  //   return from(this.employeeRepository.findOne({ where: { rfidtag: rfidTag } })).pipe(
  //     switchMap(employee => {
  //       if (!employee) {
  //         throw new BadRequestException('Employee not found');
  //       }
  
  //       // Create a new access log entry
  //       const accessLog: _dbaccesslog = {
  //         employee,
  //         accessDateTime: new Date(),
  //         accessType: accessType || '', // Use provided value or empty string if not provided
  //         roleAtAccess: roleAtAccess || '', // Use provided value or empty string if not provided
  //         id: 0,
  //         rfidtag: ''
  //       };
  
  //       // Save the access log
  //       return from(this.accessLogRepository.save(accessLog)).pipe(
  //         map(() => {})
  //       );
  //     })
  //   );
  // }
  

  findByEmployeeId(employeeId: number): Promise<_dbaccesslog[]> {
    return this.accessLogRepository.find({ where: { employee: { id: employeeId } } });
  }

  findByDate(date: Date): Promise<_dbaccesslog[]> {
    // Filter access logs by date (ignoring time) and include additional information
    return this.accessLogRepository
      .createQueryBuilder('accessLog')
      .where('DATE(accessLog.accessDateTime) = :date', { date: date.toISOString().split('T')[0] })
      .select(['accessLog.id', 'accessLog.accessDateTime', 'accessLog.accessType'])
      .getMany()
      .then(filteredLogs => {
        if (!filteredLogs || filteredLogs.length === 0) {
          throw new NotFoundException(`No access logs found for date: ${date}`);
        }
        return filteredLogs;
      })
      .catch(error => {
        throw new Error(`Error fetching access logs by date: ${error.message}`);
      });
  }

}
