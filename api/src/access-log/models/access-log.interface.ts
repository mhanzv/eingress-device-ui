import { _dbemployee } from '../../employee-list/models/employee.entity';

export interface AccessLog {
  id: number;
  employee: _dbemployee;
  accessDateTime: Date;
  accessType: string;
  roleAtAccess: string;
}
