import { CommonModule } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { Message } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { AdminApiService } from 'src/app/services/adminapi.service';

@Component({
  selector: 'app-add-weekly-planning',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, MessagesModule, ReactiveFormsModule, DropdownModule, ProgressSpinnerModule, ButtonModule, InputTextModule, BreadcrumbModule, TableModule, PaginatorModule],
  templateUrl: './add-weekly-planning.component.html',
  styleUrl: './add-weekly-planning.component.scss'
})
export class AddWeeklyPlanningComponent implements OnInit {
    breadcrumbItems: any[] = [];
    weeklyPlanningData = [];
    weeklyPlanningDataBT = [];
    pagination: any;
    loadingWPD = false;
    loadingModules = false;
    module_id : string | null = null;
    moduleOptions: any[] = [];
    savedModules: boolean | null = null;
    loadingMarkComplete: boolean = false;
    loadingDownload: boolean = false;
    isCompleteDisabled = false;
    visibleEditDialog = false;
    updateWeeklyReportForm: FormGroup;
    loadingSubmit = false;
    selectedRow: any;
    today = new Date();
    messages: Message[] | undefined;

    constructor(
        private adminApiService: AdminApiService,
        private fb: FormBuilder
    ){
        this.updateWeeklyReportForm = this.fb.group({
            rm_tpm_booking: [''],
            rm_due_to_development: [''],
            gap: [''],
        });
    }
    ngOnInit(): void {
        this.breadcrumbItems = [
            { label: 'Home', routerLink: '/' },
            { label: 'Weekly Planning' }
        ];
        // this.loadWeeklyPlanningData();
        this.loadModuleOptions();
    }

    addTotalRow(){
        const originalData = structuredClone(this.weeklyPlanningDataBT);
        // Initialize totals
        const totalRow: any = {
            machine_name: 'Total',
            capacity: 0,
            single_mc_shift_capacity: 0,
            no_of_machines: 0,
            plan_no_of_machine: 0,
            machine_speed: 0,
            no_of_shift: 0,
            per_of_efficiency: 0,
            no_of_days_booking: 0,
            pending_wt: 0,
            no_of_day_weekly_planning: 0,
            allocated_product_wt: 0,
            rm_tpm_booking: 0,
            rm_due_to_development: 0,
            gap: 0,
        };
        this.isCompleteDisabled = false;
        // Sum numeric fields
        for (const row of originalData) {
            totalRow.no_of_machines += Number(row.no_of_machines || 0);
            totalRow.plan_no_of_machine += Number(row.plan_no_of_machine || 0);
            totalRow.machine_speed += Number(row.machine_speed || 0);
            totalRow.no_of_shift += Number(row.no_of_shift || 0);
            totalRow.per_of_efficiency += Number(row.per_of_efficiency || 0);
            totalRow.no_of_days_booking += Number(row.no_of_days_booking || 0);
            totalRow.pending_wt += Number(row.pending_wt || 0);
            totalRow.no_of_day_weekly_planning += Number(row.no_of_day_weekly_planning || 0);
            totalRow.allocated_product_wt += Number(row.allocated_product_wt || 0);
            totalRow.rm_tpm_booking += Number(row.rm_tpm_booking || 0);
            totalRow.rm_due_to_development += Number(row.rm_due_to_development || 0);
            totalRow.gap += Number(row.gap || 0);
            totalRow.capacity += Number(row.capacity || 0);
            totalRow.single_mc_shift_capacity += Number(row.single_mc_shift_capacity || 0);

            this.isCompleteDisabled = this.isCompleteDisabled ? true : (Number(row.no_of_days_booking || 0) > 6);
        }

        // Convert back to strings if needed for table compatibility
        for (const key in totalRow) {
            if (key !== 'machine_name') {
                totalRow[key] = totalRow[key].toString();
            }
        }
        this.weeklyPlanningData = originalData.length > 0 ? [...originalData, totalRow] : originalData;
    }

    loadWeeklyPlanningData(){
        if(this.module_id ==  null){
            this.weeklyPlanningDataBT = [];
            this.weeklyPlanningData = [];
            return;
        }
        this.loadingWPD = true;
        const data = this.module_id ? {module_id: this.module_id}: {};
        this.adminApiService.weeklyPlanningData(data).subscribe({
            next: (res: any)=>{
                const originalData = res.data;
                this.weeklyPlanningDataBT = structuredClone(originalData);
                this.addTotalRow();
                this.loadingWPD = false;
            }, 
            error: (err: any)=>{
                this.loadingWPD = false;
                this.messages = [
                    { severity: 'error', detail: err?.error?.message ?? 'Something went wrong.' }
                ];
            }
        });
    }

    loadModuleOptions(){
        this.loadingModules = true;
        this.adminApiService.get_all_modules().subscribe({
            next: (res: any)=>{
            const moduleOptions = res.data.map(value => ({...value, label: `${value.name} - ${value.responsible}`}));
            const savedModulesArr = res.savedModules.map(val=>val.module);
            const unSavedModules = moduleOptions.filter(val => !savedModulesArr.includes(val.id) );
            const savedModules = moduleOptions.filter(val => savedModulesArr.includes(val.id) );
            this.moduleOptions = [
                {
                    label: 'Not Saved',
                    value: 'notSaved',
                    items: unSavedModules
                },
                {
                    label: 'Saved',
                    value: 'saved',
                    items: savedModules
                },
            ];
            this.loadingModules = false;
            }, 
            error: (err: any)=>{
            this.loadingModules = false;

            }
        });
    }

    onModuleChange(event: {originalEvent: Event; value: any}) {
        if (event.value == null) {
            this.module_id = null;
            this.savedModules = null;
            this.weeklyPlanningDataBT = [];
            this.weeklyPlanningData = [];
        } else {
            this.module_id = event.value;
            const savedModules = this.moduleOptions.filter(val => val.value == 'saved')[0].items.map(val=>val.id);
            this.savedModules = savedModules.includes(this.module_id);
            this.loadWeeklyPlanningData();
        }
    }

    completeWeeklyReportForMoudle(){
        if(this.isCompleteDisabled || this.module_id==null){
            return;
        }
        this.loadingMarkComplete = true;
        this.adminApiService.completeWeeklyReportForMoudle({module_id: Number(this.module_id)}).subscribe({
            next: (res: any)=>{
                this.savedModules = true;
                this.loadingMarkComplete = false;
                this.loadModuleOptions();
                this.messages = [
                    { severity: 'success', detail: res?.message ?? 'Added Successfully.' }
                ];
            }, 
            error: (err: any)=>{
                this.loadingMarkComplete = false;
                this.messages = [
                    { severity: 'error', detail: err?.error?.message ?? 'Something went wrong.' }
                ];
            }
        });
    }


    openEditModel(row: any){
        if(row.machine_name === 'Total'){
            return;
        }
        if(this.moduleOptions.filter(val => val.value == 'saved')[0].items.map(val=>val.id).includes(String(this.module_id))){
            return;
        }
        this.selectedRow = row;
        this.updateWeeklyReportForm.reset();
        this.updateWeeklyReportForm.patchValue({
            rm_tpm_booking: this.selectedRow.rm_tpm_booking,
            rm_due_to_development: this.selectedRow.rm_due_to_development,
            gap: this.selectedRow.gap,
        });
        this.visibleEditDialog = true;
    }

    onSubmit(){
        if(this.selectedRow && this.module_id){
            this.loadingSubmit = true;
            this.adminApiService.updateWeeklyReportFields({module_id: this.module_id, machine_id: this.selectedRow.machine_id, ...this.updateWeeklyReportForm.value}).subscribe({
                next: (res: any)=>{
                    const original = structuredClone(this.weeklyPlanningDataBT);
                    const newOriginal = original.map(val => 
                        val.machine_id == this.selectedRow.machine_id ? 
                        { 
                            ...val,
                            rm_tpm_booking: Number(this.updateWeeklyReportForm.value.rm_tpm_booking) ,
                            rm_due_to_development: Number(this.updateWeeklyReportForm.value.rm_due_to_development) ,
                            gap: Number(this.updateWeeklyReportForm.value.gap) 
                        } : val);
                    this.weeklyPlanningDataBT = structuredClone(newOriginal);
                    this.addTotalRow();
                    this.updateWeeklyReportForm.reset();
                    this.visibleEditDialog = false;
                    this.loadingSubmit = false;
                    this.messages = [
                        { severity: 'success', detail: res?.message ?? 'Added Successfully.' }
                    ];
                }, 
                error: (err: any)=>{
                    this.loadingSubmit = false;
                    this.messages = [
                        { severity: 'error', detail: err?.error?.message ?? 'Something went wrong.' }
                    ];
                }
            });
        }
    }

    checkNumberInput(controlName: string) {
        const control = this.updateWeeklyReportForm.get(controlName);
        const value = control?.value;
        if (value !== null && value !== undefined) {
            const numericValue = value.toString().replace(/[^0-9]/g, '');
            control?.setValue(numericValue, { emitEvent: false });
        }
    }
}
