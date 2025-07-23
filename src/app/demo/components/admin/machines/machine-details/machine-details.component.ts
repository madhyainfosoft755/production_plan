import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AdminApiService } from 'src/app/services/adminapi.service';

@Component({
  selector: 'app-machine-details',
  templateUrl: './machine-details.component.html',
  styleUrl: './machine-details.component.scss'
})
export class MachineDetailsComponent implements OnInit, OnChanges {
  @Output() notifyParent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedMachine: any;
  machineForm: FormGroup;
  loading = false;
  backendErrors: any = {};

  // Role Dropdown Options
  processOptions = [
    { label: 'Forging', value: 'Forging' },
    { label: 'Heating', value: 'Heating' },
    { label: 'Finish', value: 'Finish' }
  ];

  shiftOptions = [
    { label: 'Shift-1', value: 1 },
    { label: 'Shift-2', value: 2 },
    { label: 'Shift-3', value: 3 },
  ];

  constructor(private fb: FormBuilder, private adminApiService: AdminApiService) {
    this.machineForm = this.fb.group(
      {
        name: ['', Validators.required],
        no_of_mc: ['', [Validators.required, , Validators.min(0)]],
        speed: ['', Validators.required],
        process: ['', Validators.required],
        capacity: ['', [Validators.required, Validators.min(1)]],
        no_of_shift: ['', [Validators.required, Validators.min(1)]],
        plan_no_of_mc: ['', [Validators.required, Validators.min(1)]],
        per_of_efficiency: ['', [Validators.required, Validators.min(1)]],
      });
  }

  ngOnInit(): void {

    // Monitor the 'name' field for validity changes
    this.machineForm.controls['name'].valueChanges.subscribe(() => {
      const nameControl = this.machineForm.controls['name'];
      const noOfMcControl = this.machineForm.controls['no_of_mc'];
      if (nameControl.invalid) {
        noOfMcControl.setValue(0); // Reset the value of no_of_mc to 0
      }
    });
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedMachine']) {
      this.selectedMachine = changes['selectedMachine'].currentValue;
      if(this.selectedMachine){
        this.machineForm.patchValue({
          name: this.selectedMachine?.name || '',
          no_of_mc: this.selectedMachine?.no_of_mc || '',
          speed: this.selectedMachine?.speed || '',
          process: this.selectedMachine?.process || '',
          capacity: this.selectedMachine?.capacity || '',
          no_of_shift: this.selectedMachine?.no_of_shift || '',
          plan_no_of_mc: this.selectedMachine?.plan_no_of_mc || '',
          per_of_efficiency: this.selectedMachine?.per_of_efficiency || '',
        });
      } else {
      
      }
    }
  }


  checkNumberInput(controlName: string) {
      const control = this.machineForm.get(controlName);
      const value = control?.value;
      // console.log(value)
      if (value !== null && value !== undefined) {
          const numericValue = value.toString().replace(/[^0-9]/g, '');
          control?.setValue(numericValue, { emitEvent: false });
          // console.log(control.value)
      }
  }


  // convenience getter for easy access to form fields
  get f() { return this.machineForm.controls; }

  // Submit Form
  onSubmit(): void {
    console.log(this.machineForm.value);
    // return
    if (this.machineForm.invalid) {
      return;
    }
    
    this.loading = true;
    if(this.selectedMachine){
      this.adminApiService.update_machine(this.selectedMachine.id, this.machineForm.value).subscribe({
        next: (res)=>{
          this.loading = false;
          // Emit an event with a message or any data
          this.notifyParent.emit(true);
        }, 
        error: (err)=>{
          this.backendErrors = err.error.errors;
          this.loading = false;
          console.log(err);
        }
      });
    } else {
      this.adminApiService.add_machine(this.machineForm.value).subscribe({
        next: (res)=>{
          this.loading = false;
          // Emit an event with a message or any data
          this.notifyParent.emit(true);
        }, 
        error: (err)=>{
          this.backendErrors = err.error.errors;
          this.loading = false;
          console.log(err);
        }
      });
    }
  }
}