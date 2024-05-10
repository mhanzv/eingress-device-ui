import { _dbemployee } from '../../employee-list/models/employee.entity';

export interface AccessLog {
  id: number;
  employee: _dbemployee;
  rfidtag:string;
  accessDateTime: Date;
  accessType: string;
  roleAtAccess: string;
}
