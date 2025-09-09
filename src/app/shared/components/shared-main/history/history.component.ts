import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { AdminApiService } from 'src/app/services/adminapi.service';
import { UnbrakoPPCommonService } from 'src/app/services/unbrako-pp-common';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-shared-history',
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent implements OnInit {
  breadcrumbItems: any[];
  filterForm: FormGroup;
  moduleOptions : any;
  machineOptions: any;
  loadingModules: boolean = false;
  loadingMachines: boolean = false;
  loadingReport: boolean = false;
  pivotData: any[] = [];  // To store pivoted data
  // Sample data (same data you've provided)
  data: any;

  constructor(
    private adminApiService: AdminApiService, 
    private fb: FormBuilder,
    private unbrakoPPCommonService: UnbrakoPPCommonService,
    private excelService: ExcelService
  ){}

  ngOnInit() :void {
    this.breadcrumbItems = [
      { label: 'Home', routerLink: '/' },
      // { label: 'Main File History' }
      { label: 'Machine Plan Report' }
    ];
    this.filterForm = this.fb.group({
      module_name: [''],
      machine_name: ['']
    });
    this.filterForm.get('module_name')?.valueChanges.subscribe((selectedModules) => {
      this.moduleChanged({ value: selectedModules });
    });
    this.filterForm.get('machine_name')?.valueChanges.subscribe((selectedMachines) => {
      this.onFilterChange(selectedMachines);
    });
    this.getModules();
  }

  getModules(){
    this.loadingModules = true;

    this.adminApiService.get_all_modules().subscribe({
      next: (res) => {
        this.loadingModules = false;
        this.moduleOptions = res.data;
      },
      error: (err) => {
        this.loadingModules = false;
        console.error(err);
      }
    });
  }

  moduleChanged(event: any){
    // console.log(event.value.map(val=>val.id))
    this.loadingMachines = true;

    this.adminApiService.getMachineForModules(event.value.map(val=>val.id)).subscribe({
      next: (res) => {
        this.loadingMachines = false;
        this.machineOptions = this.unbrakoPPCommonService.groupMachines(res.data);
        console.log(this.machineOptions)
      },
      error: (err) => {
        this.loadingMachines = false;
        console.error(err);
      }
    });
  }

  // Update filtered data based on selected filters
  onFilterChange(selectedMachines: string[]) {
    this.loadingReport = true;
    const moduleIds = this.filterForm.get('module_name')?.value.map(val=>val.id);
    const machineRevIds = selectedMachines;
    this.adminApiService.machineWiseModuleWiseMonthlyReport({moduleIds, machineRevIds}).subscribe({
      next: (res) => {
        this.loadingReport = false;
        this.data = res.data
        // .map((val: any)=> {
        //   return this.unbrakoPPCommonService.SAPMainFileMapping(val);
          // const to_forge_qty = (+val.orderQuantity_GMEIN - (+val.confirmedQuantity_GMEIN)); //--
          // const to_forge_wt = (to_forge_qty * val.finish_wt)/1000; //--
          // const to_forge_rm_wt = +to_forge_wt * 1.2; //--
          // const this_month_forge_wt = (val.this_month_forge_qty * val.finish_wt)/1000; //--
          // const this_month_forge_rm_wt = this_month_forge_wt * 1.2; //--

          // const act_allocated_balance_rm_wt = this_month_forge_rm_wt >= val.advance_final_rm_wt ? 0 : val.advance_final_rm_wt-this_month_forge_rm_wt; //--
          // const allocated_balance_rm_wt = act_allocated_balance_rm_wt == 0 ? 0 : act_allocated_balance_rm_wt; //--
          // const allocated_product_wt = +allocated_balance_rm_wt/1.2;  // --

          // const per_of_efficiency = 60; // --
          // const per_day_booking = +(val.machine_speed*450)*(per_of_efficiency/100)*val.no_of_shift*val.plan_no_of_machine; // --
          // const final_pending_qty = to_forge_qty - val.this_month_forge_qty; // --
          // const allocated_product_qty = (allocated_product_wt*1000)/val.finish_wt; // --
          // const pending_form_outside = to_forge_rm_wt-val.advance_final_rm_wt; // --

          // // const no_of_day_pending = Date()-Date(val.delivery_date) ; // --
          // const no_of_day_pending = 5; // --

          // // const no_of_days_booking = (final_pending_qty === 0 || final_pending_qty < 0) ? 0 : final_pending_qty / per_day_booking;
          // // const no_of_day_weekly_planning = (allocated_product_qty === 0 || allocated_product_qty < 0 ) ? 0 : allocated_product_qty/per_day_booking;
          
          // const pending_qty = to_forge_qty - val.this_month_forge_qty ; // --
          // const pending_wt = (+pending_qty * val.finish_wt) / 1000
          // const pending_rm_wt = pending_wt*1.2;
          
          // return {...val, 
          //   to_forge_qty: parseFloat(to_forge_qty.toFixed(2)),
          //   to_forge_wt: parseFloat(to_forge_wt.toFixed(2)),
          //   to_forge_rm_wt:parseFloat(to_forge_rm_wt.toFixed(2)),
          //   per_day_booking: per_day_booking,
          //   pending_form_outside: pending_form_outside,
          //   no_of_day_pending: no_of_day_pending,
          //   allocated_product_wt: allocated_product_wt,
          //   allocated_balance_rm_wt: allocated_balance_rm_wt,
          //   allocated_product_qty: allocated_product_qty,
          //   final_pending_qty: final_pending_qty,
          //   pending_qty: pending_qty,
          //   pending_wt: pending_wt,
          //   pending_rm_wt: pending_rm_wt,
            
          //   this_month_forge_wt: this_month_forge_wt,
          //   this_month_forge_rm_wt: this_month_forge_rm_wt,
          //   act_allocated_balance_rm_wt: act_allocated_balance_rm_wt,
          //   per_of_efficiency: per_of_efficiency,
          // }
        // });
        // this.updateFilteredData();
        // Create pivot data based on grouping by prod_group, size, spec
        // this.pivotData = this.createPivot(this.data);
        this.pivotData = this.summingOfSPEC(this.data);
        const fileName = 'Pivot Data';
        // this.excelService.generateExcelFile(fileName, this.data);
      },
      error: (err) => {
        this.loadingReport = false;
        console.error(err);
      }
    });
  }

  // Function to aggregate data and format it into a pivot table-like structure
  updateFilteredData() {
    let filteredData = [...this.data];
    console.log([...this.data])
    const moduleNames = this.filterForm.get('module_name')?.value.map(val=>val.id);
    const machineNames = this.filterForm.get('machine_name')?.value;
    console.log(moduleNames);
    console.log(machineNames)
    // Apply filters
    if (moduleNames) {
      // filteredData = filteredData.filter(item => item.module_name === moduleNames);
      // filteredData = filteredData.filter(item => item.module_id === moduleNames);
      filteredData = filteredData.filter(item => moduleNames.includes(item.module_id));
    }
    if (machineNames && machineNames.length > 0) {
      // filteredData = filteredData.filter(item => machineNames.includes(item.machine_name));
      filteredData = filteredData.filter(item => machineNames.includes(item.machine_id));
    }

    console.log(filteredData);

    // Create pivot data based on grouping by prod_group, size, spec
    this.pivotData = this.createPivot(filteredData);
  }

  // Aggregate data into pivot table format (group by prod_group, size, spec)
  createPivot(filteredData: any[]) {
    const pivot = [];

    filteredData.forEach(item => {
      // Find existing group in pivot
      let group = pivot.find(p => p.prod_group === item.prod_group && p.size === item.size && p.spec === item.spec);

      // If no group exists, create a new one
      if (!group) {
        group = {
          prod_group: item.prod_group,
          size: item.size,
          spec: item.spec,
          machines: {}
        };
        pivot.push(group);
      }

      // Aggregate machine data (sum to_forge_qty, to_forge_wt, to_forge_rm_wt)
      if (!group.machines[item.machine_name]) {
        group.machines[item.machine_name] = {
          to_forge_qty: 0,
          to_forge_wt: 0,
          to_forge_rm_wt: 0
        };
      }

      group.machines[item.machine_name].to_forge_qty += item.to_forge_qty;
      group.machines[item.machine_name].to_forge_wt += item.to_forge_wt;
      group.machines[item.machine_name].to_forge_rm_wt += item.to_forge_rm_wt;
    });

    return pivot;
  }

  summingOfSPECOld(data: any){
    let result = [];
    let specTotals = { to_forge_qty: 0, to_forge_wt: 0, to_forge_rm_wt: 0 };
    let lastSpec = null;

    data.forEach(row => {
      if (lastSpec !== null && lastSpec !== row.spec) {
          result.push({ spec: "Total", ...specTotals });
          specTotals = { to_forge_qty: 0, to_forge_wt: 0, to_forge_rm_wt: 0 };
      }
      result.push(row);
      specTotals.to_forge_qty += row.to_forge_qty || 0;
      specTotals.to_forge_wt += row.to_forge_wt || 0;
      specTotals.to_forge_rm_wt += row.to_forge_rm_wt || 0;
      lastSpec = row.spec;
    });

    if (lastSpec !== null) {
        result.push({ spec: "Total", ...specTotals });
    }
    // console.log(result);
    return result;
  }

  summingOfSPEC(data: any){
    // Step 1: Grouping data
    const groupedData = {};

    data.forEach(entry => {
        const key = `${entry.group_id || "null"}|${entry.size}|${entry.spec}`;

        if (!groupedData[key]) {
            groupedData[key] = {
                entries: [],
                to_forge_qty: 0,
                to_forge_wt: 0,
                to_forge_rm_wt: 0
            };
        }

        groupedData[key].entries.push(entry);
        groupedData[key].to_forge_qty += entry.to_forge_qty;
        groupedData[key].to_forge_wt += entry.to_forge_wt;
        groupedData[key].to_forge_rm_wt += entry.to_forge_rm_wt;
    });

    console.log(groupedData)

    // Step 2: Creating the final output with total rows
    const finalData = [];

    Object.keys(groupedData).forEach(key => {
        const [prod_group, size, spec] = key.split("|");
        finalData.push(...groupedData[key].entries);

        // Append a total row for each group
        finalData.push({
            id: "total",
            // prod_group: prod_group === "null" ? null : prod_group,
            prod_group: '',
            size: '',
            spec: "Total",
            to_forge_qty: Number(groupedData[key].to_forge_qty).toFixed(2),
            to_forge_wt: Number(groupedData[key].to_forge_wt).toFixed(2),
            to_forge_rm_wt: Number(groupedData[key].to_forge_rm_wt).toFixed(2),
            is_total: true
        });
    });

    // Output result
    // console.log(JSON.stringify(finalData, null, 4));
    return finalData;
  }

}
