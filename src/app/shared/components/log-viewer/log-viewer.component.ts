import { Component } from '@angular/core';

import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-log-viewer',
  template: `
    <div class="card">

      <div class="grid align-items-end">
        <div class="col-4">
          <label for="logFileType">Select Type: </label>
          <p-dropdown 
              [options]="logFileTypes" 
              [(ngModel)]="selectedType" 
              optionLabel="label"
              optionValue="value" 
              placeholder="Select Type" />
        </div>
        <div class="col-4">
          <label for="logDate">Select Log Date: </label>
          <p-calendar
            [(ngModel)]="selectedDate"
            inputId="logDate"
            dateFormat="yy-mm-dd"
            showIcon="true"
            [showButtonBar]="true"
          ></p-calendar>
        </div>
  
        <div class="col-4">
          <button
            pButton
            type="button"
            label="Fetch Log"
            icon="pi pi-search"
            (click)="fetchLog()"
            [disabled]="loading"
          ></button>
        </div>
      </div>
      <div class="col-12">
        <div *ngIf="loading" class="mt-3 text-center">
          <p-progressSpinner styleClass="custom-spinner"></p-progressSpinner>
          <p>Loading log...</p>
        </div>
  
        <div *ngIf="errorMessage" class="p-error mt-2">
          {{ errorMessage }}
        </div>
  
        <div *ngIf="logContent" class="log-container mt-3">
          <pre>{{ logContent }}</pre>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .log-container {
      background-color: #f9f9f9;
      padding: 1rem;
      border: 1px solid #ccc;
      max-height: 500px;
      overflow-y: auto;
      white-space: pre-wrap;
      font-family: monospace;
    }
  `]
})
export class LogViewerComponent {
  selectedDate: Date | null = null;
  logContent: string = '';
  loading: boolean = false;
  errorMessage: string = '';
  logFileTypes = [
    {
      label: 'Normal',
      value: 'normal'
    },
    {
      label: 'CLI Job',
      value: 'cli'
    }
  ];
  selectedType;

  constructor(
    private apiService: ApiService
  ) {
    this.selectedType = 'normal';
  }

  fetchLog() {
    this.errorMessage = '';
    this.logContent = '';

    if (!this.selectedDate) {
      this.errorMessage = 'Please select a date.';
      return;
    }

    const formattedDate = this.formatDate(this.selectedDate);

    this.loading = true;
    this.apiService.getLogs(formattedDate, this.selectedType).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.logContent = res?.log_content || 'No content in log file.';
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Failed to fetch log.';
      }
    });
  }

  formatDate(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }
}
