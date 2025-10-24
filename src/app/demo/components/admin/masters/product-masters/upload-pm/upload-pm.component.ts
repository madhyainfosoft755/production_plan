import { Component, OnInit } from '@angular/core';
import { AdminApiService } from 'src/app/services/adminapi.service';
import * as XLSX from 'xlsx';
import * as Papa from 'papaparse';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-upload-pm',
  templateUrl: './upload-pm.component.html',
  styles: ``
})
export class UploadPMComponent implements OnInit {
  breadcrumbItems: any[];
  selectedFile: File | null = null;
  allowedFileTypes = ['xlsx', 'csv'];
  expectedHeaders = [
    { name: 'Order', type: 'varchar' },
    { name: 'Material Number', type: 'varchar' },
    { name: 'Material Number Froging', type: 'varchar' },
    { name: 'Material Description', type: 'varchar' },
    { name: 'Machine Name', type: 'varchar' },
    { name: 'Module', type: 'varchar' },
    { name: 'Unit of Measure', type: 'varchar' },
    { name: 'Seg-2', type: 'varchar' },
    { name: 'Seg-3', type: 'varchar' },
    { name: 'Product Size', type: 'varchar' },
    { name: 'Product Group', type: 'varchar' },
    { name: 'Product Length', type: 'varchar' },
    { name: 'Finish', type: 'varchar' },
    { name: 'Segment', type: 'varchar' },
    { name: 'Finish Wt', type: 'number' },
    { name: 'Cheese Wt', type: 'number' },
    { name: 'RM SPEC', type: 'varchar' },
    { name: 'ROD DIA1', type: 'varchar' },
    { name: 'DRAWN DIA1', type: 'varchar' },
    { name: 'Special Remarks', type: 'varchar' },
    { name: 'BOM', type: 'varchar' },
    { name: 'RM Component', type: 'varchar' },
    { name: 'Condition of Raw material', type: 'varchar' }
  ];
  errorMessage: string = '';
  loading = false;
   messages: Message[] | undefined;

  constructor(
    private adminApiService: AdminApiService,
    private router: Router
  ) {}

  ngOnInit() :void {
    this.breadcrumbItems = [
      { label: 'Home', routerLink: '/' },
      { label: 'Product Master', routerLink: '/admin/masters/product-master' },
      { label: 'Upload PM' }
    ];
  }

  validateDataType(value: any, expectedType: string): boolean {
    switch (expectedType) {
      case 'varchar':
        return typeof value === 'string' || value instanceof String;
      case 'number':
        return !isNaN(Number(value));
      case 'date':
        return !isNaN(Date.parse(value));
      default:
        return false;
    }
  }

  // onFileChange(event: any): void {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const fileExtension = file.name.split('.').pop()?.toLowerCase();
  //     if (this.allowedFileTypes.includes(fileExtension!)) {
  //       this.selectedFile = file;
  //       this.errorMessage = '';
  //     } else {
  //       this.errorMessage = 'Invalid file type. Only XLSX and CSV files are allowed.';
  //       this.selectedFile = null;
  //     }
  //   }
  // }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    this.messages = undefined;
    if (!file) {
      this.errorMessage = 'No file selected.';
      this.selectedFile = null;
      return;
    }

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!this.allowedFileTypes.includes(fileExtension!)) {
      this.errorMessage = 'Invalid file type. Only XLSX and CSV files are allowed.';
      this.selectedFile = null;
      return;
    }

    this.selectedFile = file;
    this.errorMessage = '';

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = e.target.result;
      if (fileExtension === 'xlsx') {
        this.validateXLSX(data);
      } else if (fileExtension === 'csv') {
        this.validateCSV(data);
      }
    };
    reader.readAsBinaryString(file);
  }

  validateXLSX(data: any): void {
    const workbook = XLSX.read(data, { type: 'binary' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows: any = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    this.validateHeadersAndData(rows);
  }

  validateCSV(data: string): void {
    Papa.parse(data, {
      complete: (result) => {
        const rows = result.data as string[][];
        this.validateHeadersAndData(rows);
      }
    });
  }

  validateHeadersAndData(rows: any[][]): void {
    if (!rows || rows.length === 0) {
      this.errorMessage = 'File is empty or invalid.';
      return;
    }

    // Extract headers
    const headers = rows[0];
    // if (headers.length !== this.expectedHeaders.length) {
    //   this.errorMessage = 'Header count mismatch.';
    //   return;
    // }

    // Check for header sequence and names
    for (let i = 0; i < headers.length; i++) {
      if (headers[i].trim() !== this.expectedHeaders[i].name) {
        this.errorMessage = `Invalid header at column ${i + 1}. Expected: '${this.expectedHeaders[i].name}', Found: '${headers[i]}'`;
        return;
      }
    }

    // Validate data types
    // for (let i = 1; i < rows.length; i++) {
    //   const row = rows[i];
    //   for (let j = 0; j < row.length; j++) {
    //     const value = row[j];
    //     const expectedType = this.expectedHeaders[j].type;
    //     if (!this.validateDataType(value, expectedType)) {
    //       this.errorMessage = `Invalid data type at row ${i + 1}, column ${j + 1}. Expected: '${expectedType}', Found: '${value}'`;
    //       return;
    //     }
    //   }
    // }

    this.errorMessage = '';
  }

  onSubmit(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select a valid file.';
      return;
    }

    const formData = new FormData();
    formData.append('upload_excel', this.selectedFile);
    this.loading = true;
    // Replace 'your-api-url' with the actual endpoint
    this.adminApiService.upload_pm(formData).subscribe({
      next: (response) => {
        this.router.navigate(['/admin/masters/product-master']);
        this.loading = false;
        this.selectedFile = null;
      },
      error: (error) => {
        this.messages = [
            { severity: 'error', summary: 'Error', detail: error.statusText || 'File upload failed.' },
        ]
        this.loading = false;
      }
    });
  }

}
