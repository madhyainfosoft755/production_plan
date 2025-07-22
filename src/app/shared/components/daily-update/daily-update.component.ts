import { CommonModule } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormsModule, FormControl, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FieldsetModule } from 'primeng/fieldset';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { AccordionModule } from 'primeng/accordion';
import { AdminApiService } from 'src/app/services/adminapi.service';
import { CommonUtilsService } from 'src/app/services/common-utils.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-daily-update',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule, FormsModule, ReactiveFormsModule, ConfirmDialogModule, AccordionModule, TableModule, ButtonModule, InputTextModule, BreadcrumbModule, FieldsetModule, DropdownModule],
  templateUrl: './daily-update.component.html',
  styleUrl: './daily-update.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class DailyUpdateComponent implements OnInit {
    breadcrumbItems: any[] = [];
    dailyUpdateForm: FormGroup;
    moduleOptions: any[] = [];
    loadingModules = false;
    loadingMachines = false;
    machinePartNumberInfo: any;
    today = new Date();
    module_id: string = '';
    saveLoading = false;
    submitLoading = false;
    current = true;
    loadingSavedTempData = false;
    moduleShiftTempData: any;
    shifts = [
        {
            id: "1",
            label: 'Shift 1 : 07:00 AM - 03:00 PM',
            name: 'Shift 1',
            startTime: '07:00 AM',
            endTime: '03:00 PM'
        },
        {
            id: "2",
            label: 'Shift 2 : 03:00 PM - 11:00 PM',
            name: 'Shift 2',
            startTime: '03:00 PM',
            endTime: '11:00 PM'
        },
        {
            id: "3",
            label: 'Shift 3 : 11:00 PM - 07:00 AM',
            name: 'Shift 3',
            startTime: '11:00 PM',
            endTime: '07:00 AM'
        }
    ]

    constructor(
        private fb: FormBuilder,
        private adminApiService: AdminApiService,
        private commonUtilService: CommonUtilsService,
        private confirmationService: ConfirmationService, 
        private messageService: MessageService
    ){
        this.dailyUpdateForm = this.fb.group({
            shift: new FormControl('', Validators.required),
            supervisor: new  FormControl('', Validators.required),
            machinePartNumberInfo: this.fb.array([]) 
        });
        this.dailyUpdateForm.markAsTouched();
    }
    ngOnInit(): void {
        this.breadcrumbItems = [
            { label: 'Home', routerLink: '/' },
            { label: 'Daily Progress' }
        ];
        this.loadModuleOptions();
        this.getSavedData();
    }

    getSavedData(){
        this.adminApiService.get_temp_saved_module_shift_data().subscribe({
            next: (res: any)=>{
                if(res.data){
                    this.dailyUpdateForm.patchValue({
                        shift : res.data.shift,
                        supervisor : res.data.supervisor,
                    });
                }
            }, 
            error: (err: any)=>{

            }
        });
    }

    getCurrentData(){
        this.current = !this.current;
    }

    getTempSavedModuleShiftData(){
        this.current = !this.current;
        this.loadingSavedTempData = true;
        this.moduleShiftTempData = null;
        this.adminApiService.get_temp_module_shift_data().subscribe({
            next: (res: any)=>{
                this.moduleShiftTempData = res.data;
                this.loadingSavedTempData = false;
            },  
            error: (err: any)=>{
                this.loadingSavedTempData = false;
            }
        });
    }

    loadModuleOptions(){
        this.loadingModules = true;
        this.adminApiService.get_all_modules().subscribe({
            next: (res: any)=>{
            this.moduleOptions = res.data.map(value => ({...value, label: `${value.name} - ${value.responsible}`}));
            this.loadingModules = false;
            }, 
            error: (err: any)=>{
            this.loadingModules = false;

            }
        });
    }

    objectKeys(obj: any): string[] {
        return Object.keys(obj);
    }

    onlyAllowNumbers(event: KeyboardEvent) {
        const charCode = event.charCode;
        if (charCode < 48 || charCode > 57) {
            event.preventDefault();
        }
    }

    makeInt(controlName: string) {
        const value = this.dailyUpdateForm.get(controlName)?.value;
        if (value != null) {
            // Remove all non-digit characters
            const numericValue = value.toString().replace(/\D/g, '');
            // Convert to number and update the control
            const intValue = numericValue ? parseInt(numericValue, 10) : null;
            this.dailyUpdateForm.get(controlName)?.setValue(intValue, { emitEvent: false });
        }
    }

    loadMachines(){
        if(this.module_id){
            this.loadingMachines = true;
            const partArray = this.dailyUpdateForm.get('machinePartNumberInfo') as FormArray;
            while (partArray.length !== 0) {
                partArray.removeAt(0);
            }
            this.adminApiService.get_all_machines_with_part_numbers(this.module_id).subscribe({
                next: (res: any)=>{
                // this.machinePartNumberInfo = this.commonUtilService.groupByMachine(res.data);
                this.machinePartNumberInfo = res.data.map((row: any) => {
                    
                    const to_forge_qty: number = +row.to_forge_limit_inc ? (+row.to_forge_qty + (+row.to_forge_limit_inc)): +row.to_forge_qty;
                    const final_pending_qty = to_forge_qty - row.forged_so_far;
                    const pending_qty = final_pending_qty <= 0 ? 0 : final_pending_qty ;

                    const group = this.fb.group({
                        id: [row.id],
                        machine_name: [row.machine_name],
                        module_id: [row.module_id],
                        machine_id: [row.machine_id],
                        materialNumber: [row.materialNumber],
                        to_forge_qty: [row.to_forge_qty],
                        forged_so_far: [row.forged_so_far],
                        pending_qty: [pending_qty],
                        input_qty: [row.production_qty ?? '', [Validators.min(0), this.maxQtyValidator(pending_qty)]]
                    });

                    partArray.push(group);
                    
                    return {
                        ...row,
                        pending_qty: pending_qty,
                    }
                });
                console.log(this.machinePartNumberInfo);
                this.loadingMachines = false;
                }, 
                error: (err: any)=>{
                this.loadingMachines = false;
    
                }
            });
        } 
    }

    maxQtyValidator(max: number) {
        return (control: FormControl) => {
            const value = +control.value;
            if (value > max) {
            return { maxExceeded: { max } };
            }
            return null;
        };
    }

    submitData(event: Event){
        if(this.dailyUpdateForm.invalid){
            return;
        }
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Do you want to submit the data?',
            header: 'Confirmation',
            icon: 'pi pi-info-circle',
            acceptButtonStyleClass:"p-button-danger p-button-text",
            rejectButtonStyleClass:"p-button-text p-button-text",
            acceptIcon:"none",
            rejectIcon:"none",

            accept: () => {
                this.submitLoading = true;
                console.log(this.dailyUpdateForm.value);
                // this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
                this.adminApiService.submit_daily_data(this.dailyUpdateForm.value).subscribe({
                    next: (res: any)=>{
                        this.submitLoading = false;
                        this.dailyUpdateForm.reset();
                        this.dailyUpdateForm.markAsTouched();
                        this.loadMachines();
                    }, 
                    error: (err: any)=>{
                        this.submitLoading = false;

                    }
                });
            },
            reject: () => {
                // this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
            }
        });
    }

    saveData(){
        this.saveLoading = true;
        console.log(this.dailyUpdateForm.value);
        this.adminApiService.save_daily_data(this.dailyUpdateForm.value).subscribe({
            next: (res: any)=>{
                this.saveLoading = false;
                this.dailyUpdateForm.markAsUntouched();
                this.loadMachines();
            }, 
            error: (err: any)=>{
                this.saveLoading = false;

            }
        });
    }
}
