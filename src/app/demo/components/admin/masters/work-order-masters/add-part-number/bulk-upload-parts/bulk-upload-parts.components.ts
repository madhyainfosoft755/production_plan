import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Message } from 'primeng/api';

import * as XLSX from 'xlsx';
import * as Papa from 'papaparse';

@Component({
  selector: 'app-bulk-upload-parts',
  templateUrl: './bulk-upload-parts.component.html',
  styles: `
    ::ng-deep .p-fluid .remove-btn .p-button {
        width: fit-content;
    }
    ::ng-deep .p-inputgroup .p-dropdown{
        border-top-right-radius: 0 !important;
        border-bottom-right-radius: 0 !important;
    }
    .border-left{
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }
  `
})
export class BulkUploadPartsComponent implements OnInit {
    selectedFile: File | null = null;
    allowedFileTypes = ['xlsx', 'csv'];
    expectedHeaders = [
        { name: 'Material Number', type: 'varchar' },
        { name: 'Order Quantity', type: 'number' }
    ];
    errorMessage: string = '';
    loading = false;
    messages: Message[] | undefined;

    @Output() notifyFileUpload: EventEmitter<File> = new EventEmitter<File>();
    @Output() notifyFileChange: EventEmitter<void> = new EventEmitter<void>();

    constructor() {}

    ngOnInit() :void {
    }

    validateDataType(value: any, expectedType: string): boolean {
        switch (expectedType) {
        case 'varchar':
            return typeof value === 'string' || value instanceof String;
        case 'number':
            return !isNaN(Number(value));
        default:
            return false;
        }
    }

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
        this.notifyFileChange.emit(); // Notify parent component of file change

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

        // const formData = new FormData();
        // formData.append('upload_excel', this.selectedFile);
        this.notifyFileUpload.emit(this.selectedFile);
    }

}