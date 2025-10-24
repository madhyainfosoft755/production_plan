
import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonUtilsService {

  constructor(private datePipe: DatePipe) {
  }
  replaceNullsWithEmpty(obj: Record<string, any>, convertDate = false): Record<string, any> {
    const updated: Record<string, any> = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        
        if (value === null || value === undefined) {
          updated[key] = '';
        } else if (value instanceof Date) {
          if(convertDate){
            updated[key] = this.datePipe.transform(value, 'dd-MM-yyyy');
          }
        } else if (typeof value === 'string') {
          updated[key] = value.trim();
        } else {
          updated[key] = value;
        }
      }
    }
    return updated;
  }

  getFormatedDate(date: Date): string {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');  // Months are 0-based
      const day = String(date.getDate()).padStart(2, '0');
      const formatted = `${year}-${month}-${day}`;

      return formatted;
  }


  groupByMachine(rows: any[]): any[] {
    const groups: { [id: string]: any } = {};

    rows.forEach(row => {
      const id = row.machine;

      if (!groups[id]) {
        groups[id] = {
          machineInfo: {
            id,
            name: row.machine_name,     // first row holds the common values
            module: row.machine_module
          },
          items: []
        };
      }
      groups[id].items.push(row);
    });

    return Object.values(groups);       // ➜ MachineGroup[]
  }
}
