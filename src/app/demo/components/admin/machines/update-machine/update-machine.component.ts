import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AdminApiService } from 'src/app/services/adminapi.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update-machine',
  templateUrl: './update-machine.component.html',
  styleUrl: './update-machine.component.scss'
})
export class UpdateMachineComponent implements OnInit {
  @Output() notifyParent: EventEmitter<boolean> = new EventEmitter<boolean>();
  machineForm: FormGroup;
  loading = false;
  backendErrors: any = {};
  machineId: string | null = null;
  machineDetails: any = null;

  // Role Dropdown Options
  processOptions = [
    { label: 'Forging', value: 1 },
    { label: 'Heating', value: 2 },
    { label: 'Finish', value: 3 }
  ];

  shiftOptions = [
    { label: 'Shift-1', value: 1 },
    { label: 'Shift-2', value: 2 },
    { label: 'Shift-3', value: 3 },
  ];

  constructor(
    private fb: FormBuilder, 
    private adminApiService: AdminApiService,
    private route: ActivatedRoute
  ) {
    this.machineForm = this.fb.group(
      {
        name: ['', Validators.required],
        no_of_mc: [0, [Validators.required, , Validators.min(0), Validators.max(10)]],
        speed: ['', Validators.required],
        process: [null],
        machine_rev: this.fb.array([]) // Dynamic form fields
      });
  }

  ngOnInit(): void {
    // Read the route parameter
    this.machineId = this.route.snapshot.paramMap.get('id');

    // Alternatively, subscribe to route param changes (useful for re-using the same component for different params)
    this.route.paramMap.subscribe((params) => {
      this.machineId = params.get('id');
      console.log('Machine ID:', this.machineId);
      if (this.machineId) {
        this.fetchMachineDetails(this.machineId);
      }
    });

    this.updateMachineRevFields();
    // Listen for changes in no_of_mc field
    this.machineForm.get('no_of_mc')?.valueChanges.subscribe(() => {
      this.updateMachineRevFields();
    });

    // Monitor the 'name' field for validity changes
    this.machineForm.controls['name'].valueChanges.subscribe(() => {
      const nameControl = this.machineForm.controls['name'];
      const noOfMcControl = this.machineForm.controls['no_of_mc'];
      if (nameControl.invalid) {
        noOfMcControl.setValue(0); // Reset the value of no_of_mc to 0
      }
    });
  }

  fetchMachineDetails(id: string): void {
    this.loading = true;

    this.adminApiService.get_machine_info(id).subscribe({
      next: (res)=>{
        this.loading = false;
        this.machineDetails = res.data;
        this.machineForm.patchValue({
          name: res.data.name,
          no_of_mc: res.data.no_of_mc,
          speed: res.data.speed,
          process: parseInt(res.data.process_id)
        });
    
        // Populate machine_rev
        const machineRevArray = this.machineForm.get('machine_rev') as FormArray;
        machineRevArray.clear(); // Removes all FormGroups from the FormArray
        res.data.rev.forEach((machine: any) => {
          machineRevArray.push(
            this.fb.group({
              machineName: [machine.name, Validators.required],
              shifts: [machine.shifts.map(val=>parseInt(val.shift)), Validators.required]
            })
          );
        });
      }, 
      error: (err)=>{
        this.backendErrors = err.error.errors;
        this.loading = false;
        console.log(err);
      }
    });
  }

  // Transform input to uppercase
  onNameInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase();
    this.machineForm.controls['name'].setValue(input.value, { emitEvent: false });
    this.machineRev.controls.forEach((control, index) => {
      control.patchValue({ machineName: `${input.value}-${index + 1}` });
    });
  }

  // Update machine_rev fields dynamically
  private updateMachineRevFields(): void {
    const noOfMachines = this.machineForm.get('no_of_mc')?.value || 0;

    while (this.machineRev.length < noOfMachines && noOfMachines<=10) {
      this.machineRev.push(
        // this.fb.control(`Machine-${this.machineRev.length + 1}`, Validators.required)
        this.fb.group({
          machineName: this.fb.control(`${this.machineForm.value.name}-${this.machineRev.length + 1}`, Validators.required),
          shifts: this.fb.control([1,2,3], Validators.required), // Add shifts control for multi-select
        })
      );
    }

    while (this.machineRev.length > noOfMachines) {
      this.machineRev.removeAt(this.machineRev.length - 1);
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.machineForm.controls; }
  get machineRev() { return this.machineForm.get('machine_rev') as FormArray; }

  // Submit Form
  onSubmit(): void {
    console.log(this.machineForm.value);
    // return
    if (this.machineForm.invalid) {
      return;
    }
    
    this.loading = true;

    this.adminApiService.update_machine(this.machineId, this.machineForm.value).subscribe({
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