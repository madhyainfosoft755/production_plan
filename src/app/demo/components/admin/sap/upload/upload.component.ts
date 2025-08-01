import { Component, OnInit } from '@angular/core';
import { AdminApiService } from 'src/app/services/adminapi.service';
import * as XLSX from 'xlsx';
import { Message } from 'primeng/api';
import * as Papa from 'papaparse';


@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent implements OnInit {
  breadcrumbItems: any[];
  selectedFile: File | null = null;
  allowedFileTypes = ['xlsx', 'csv'];
  expectedHeaders = [
    { name: 'Order', type: 'varchar' },
    { name: 'Material', type: 'varchar' },
    { name: 'Material description', type: 'varchar' },
    { name: 'Plant', type: 'varchar' },
    { name: 'Order quantity', type: 'number' },
    { name: 'Delivered quantity', type: 'number' },
    { name: 'Confirmed quantity', type: 'number' },
    { name: 'Unit of measure', type: 'varchar' },
    { name: 'Batch', type: 'varchar' },
    { name: 'System Status', type: 'varchar' },
    { name: 'Start date (sched)', type: 'date' },
    { name: 'Scheduled finish date', type: 'date' },
    { name: 'Sales Order', type: 'varchar' }
  ];
  errorMessage: string = '';
  loading = false;
  loadingSAPFileStatus = true;
  messages: Message[] | undefined;
  loadingValidate = false;
  SAPFileStatus: any = null;
  loadingSAPFailedRecords = false;
  loadingSAPTemplate = false;

  constructor(private adminApiService: AdminApiService) {}

  ngOnInit() :void {
    this.breadcrumbItems = [
      { label: 'Home', routerLink: '/' },
      { label: 'Upload SAP File' }
    ];

    this.getSAPFileStatus();
  }

  getSAPFileStatus(){
    this.loadingSAPFileStatus = true;
    this.adminApiService.getSAPFileStatus().subscribe({
      next: (response) => {
        console.log(response)
        this.SAPFileStatus = response.data ?? {status: 'completed'} ;
        this.loadingSAPFileStatus = false;
      },
      error: (error) => {
        this.loadingSAPFileStatus = false;
      }
    });
  }


  validateSAPFile(){
    this.loadingValidate = true;
    this.adminApiService.validateSAPFile().subscribe({
      next: (response) => {
        if(response.status === "failed"){
          // this.messageService.add({ severity: 'warn', summary: 'Information', detail: 'No Record Found' });
        }
        this.getSAPFileStatus();
        this.loadingValidate = false;
      },
      error: (error) => {
        this.loadingValidate = false;
      }
    });
  }

  downloadSAPTemplate(){
    this.loadingSAPTemplate = true;
    this.adminApiService.download_sap_template().subscribe({
      next: (blob: Blob)=>{
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'SAPTemplate.xlsx';
        a.click();
        this.loadingSAPTemplate = false;
      }, 
      error: (err: any)=>{
        console.log(err);
        this.loadingSAPTemplate = false;
      }
    });
  }

  loadSAPFailedRecords(){
    this.loadingSAPFailedRecords = true;
    this.adminApiService.getSAPFailedRecords().subscribe({
      next: (res: Blob)=>{
        // if(res?.status === "failed"){
        //   this.messageService.add({ severity: 'warn', summary: 'Information', detail: 'No Record Found' });
        // } else {
          const a = document.createElement('a');
          a.href = URL.createObjectURL(res);
          a.download = 'FailedSAPData.xlsx';
          a.click();
        // }

        this.getSAPFileStatus();
        this.loadingSAPFailedRecords = false;
      }, 
      error: (err: any)=>{
        console.log(err);
        this.loadingSAPFailedRecords = false;
      }
    });
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
    console.log('File is valid!');
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
    this.adminApiService.upload_sap(formData).subscribe({
      next: (response) => {
        this.messages = [
            { severity: 'success', summary: 'Success', detail: 'File Uploaded Successfully.' },
        ]
        this.getSAPFileStatus();
        this.loading = false;
        console.log('File uploaded successfully:', response);
      },
      error: (error) => {
        this.messages = [
            { severity: 'error', summary: 'Error', detail: error.statusText || 'File upload failed.' },
        ]
        this.loading = false;
        console.error('File upload failed:', error);
      }
    });
  }

}
