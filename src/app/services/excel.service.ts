import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  constructor() {}

  generateExcelFile(fileName: string, data: any[]): void {
    if (!data || data.length === 0) {
      console.error('No data provided to export');
      return;
    }

    // Create a worksheet from the data
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    // Create a workbook and append the worksheet
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Convert workbook to a Blob
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Save the file
    const dataBlob: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    saveAs(dataBlob, `${fileName}.xlsx`);
  }
}
