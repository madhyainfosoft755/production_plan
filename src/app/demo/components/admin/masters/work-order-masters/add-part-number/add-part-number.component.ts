import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminApiService } from 'src/app/services/adminapi.service';
import { debounceTime, catchError, switchMap, of } from 'rxjs';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-add-part-number',
  templateUrl: './add-part-number.component.html',
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
export class AddPartNumberComponent implements OnInit {
  @Output() notifyParent: EventEmitter<boolean> = new EventEmitter<boolean>();
  workOrderForm: FormGroup;form: FormGroup;
  loadingWODB = false;
  workOrderDB = [];
  finish = [];
  loadingWOInfo = false;
  loadingSubmit = false;
  WOInfo = null;
  loadingPartInfo: boolean[] = [];
  partNumberInfo: any[] = [];
  selectedWorkOrder: string | number | null = null;

  addPartsOn = true;
  loadingFileUpload = false;
  messages: Message[] | undefined;

  constructor(private fb: FormBuilder, private adminApiService: AdminApiService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      parts: this.fb.array([this.createPartGroup()])
    });

    this.setupPartNumberValidation(); // watch & validate via API
    this.loadWorkOrderdb();

  }

  loadWorkOrderdb(){
    this.loadingWODB = true;
    this.adminApiService.get_all_wo_db_and_finish().subscribe({
      next: (res: any)=>{
        this.workOrderDB = res.data.work_order_db;
        this.finish = res.data.finish;
        this.loadingWODB = false;
      }, 
      error: (err: any)=>{
        this.loadingWODB = false;
      }
    });
  }

    loadWOInfo(){
        this.WOInfo = null;
        this.loadingWOInfo = true;
        this.adminApiService.get_all_wo_db_and_finish().subscribe({
            next: (res: any)=>{
                this.WOInfo = res.data;;
                this.loadingWOInfo = false;
            }, 
            error: (err: any)=>{
                this.loadingWOInfo = false;
            }
        });
    }

    get parts(): FormArray {
        return this.form.get('parts') as FormArray;
    }

    createPartGroup(): FormGroup {
        return this.fb.group({
            part_number: ['', [Validators.required]],
            quantity: [null, [Validators.required, Validators.pattern(/^\d+$/)]],
            finish: ['']
        });
    }

    addPartOn(){
        this.addPartsOn = true;
    }
    addPart(): void {
        this.parts.push(this.createPartGroup());
        this.setupPartNumberValidation(); // Add validation for new row
    }

    removePart(index: number): void {
        this.parts.removeAt(index);
    }

    setupPartNumberValidation(): void {
        this.parts.controls.forEach((group: AbstractControl, index: number) => {
        const partNumberControl = group.get('part_number');

        partNumberControl.valueChanges
            .pipe(
            debounceTime(500),
            switchMap(value => {
                this.partNumberInfo[index] = null; // Reset info
                this.loadingPartInfo[index] = true;        // Start loading

                return this.adminApiService.checkPartNumber(value).pipe(
                    catchError(() => of({ notFound: true })),
                );
                })
            )
            .subscribe(response => {
                this.loadingPartInfo[index] = false;
                if ((response as any).notFound) {
                    partNumberControl.setErrors({ notFound: true });
                } else {
                    // Store response.data
                    this.partNumberInfo[index] = (response as any).data;
                    // Remove notFound error if it exists
                    if (partNumberControl.hasError('notFound')) {
                        const errors = partNumberControl.errors;
                        delete errors['notFound'];
                        if (Object.keys(errors).length === 0) {
                            partNumberControl.setErrors(null);
                        } else {
                            partNumberControl.setErrors(errors);
                        }
                    }
                }
            });
        });
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            // alert('Form is invalid. Please correct errors.');
            return;
        }
        if (!this.selectedWorkOrder) {
            return;
        }

        // Final check to ensure all part numbers are valid
        const hasInvalidParts = this.parts.controls.some(control =>
            control.get('part_number').hasError('notFound')
        );

        if (hasInvalidParts) {
            // alert('One or more part numbers are not found.');
            return;
        }

        // Submit logic here

        this.loadingSubmit = true;
        this.adminApiService.add_part_number_sap(Number(this.selectedWorkOrder), this.form.value).subscribe({
            next: (res: any)=>{
                this.notifyParent.emit(true);
                this.loadingSubmit = false;
            }, 
            error: (err: any)=>{
                this.loadingSubmit = false;
            }
        });
    }

    bulkUploadParts(){
        this.addPartsOn = false;
    }

    onFileUploaded(file: File){
        // Handle the uploaded file (e.g., send to API)
        console.log('File received from child component:', file);
        // You can implement the logic to send this file to your API or process it as needed.
        this.loadingFileUpload = true;
        const formData = new FormData();
        formData.append('upload_excel', file);
        formData.append('work_order_id', this.selectedWorkOrder.toString());
        this.adminApiService.upload_part_number_bulk(formData).subscribe({
            next: (response: any)=>{      
                console.log(response);
                const contentType = response.headers.get('Content-Type');

                // If backend returned JSON (validation message)
                if (contentType?.includes('application/json')) {

                    const reader = new FileReader();

                    reader.onload = () => {
                        const json = JSON.parse(reader.result as string);
                        console.log('JSON response:', json);

                        this.loadingFileUpload = false;
                        this.notifyParent.emit(true);
                    };

                    reader.readAsText(response.body!);
                    return;
                }

                
                const blob = response.body!;
                const contentDisposition = response.headers.get('Content-Disposition');
                let filename = this.selectedWorkOrder.toString() + '.xlsx'; // default fallback
                if (contentDisposition) {
                    const matches = /filename="([^"]+)"/.exec(contentDisposition);
                    if (matches?.[1]) {
                        filename = matches[1];
                    }
                }

                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = filename;
                a.click();

                URL.revokeObjectURL(a.href); // clean up
                this.messages = [
                    { severity: 'error', detail: 'Some Parts are not found in the database.' }
                ];
                this.loadingFileUpload = false;
            },
            error: (err: any)=>{
                this.loadingFileUpload = false;
            }
        });
    }
}