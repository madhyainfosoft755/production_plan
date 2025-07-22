import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { AdminApiService } from 'src/app/services/adminapi.service';
import { UnbrakoPPCommonService } from 'src/app/services/unbrako-pp-common';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-report4',
  templateUrl: './report4.component.html',
  styleUrl: './report4.component.scss'
})
export class Report4Component implements OnInit {
  breadcrumbItems: any[];
  filterForm: FormGroup;
  moduleOptions : any;
  machineOptions: any;
  loadingModules: boolean = false;
  loadingMachines: boolean = false;
  loadingReport: boolean = false;
  pivotData: any[] = [];  // To store pivoted data
  // Sample data (same data you've provided)
  data = [
    {
        "id": "62",
        "orderNumber": "B2973",
        "plant": "MP01",
        "materialNumber": "550775J",
        "materialDescription": "HEX HEAD BOLT M22X40 CL10.9 F/T BLK",
        "orderQuantity_GMEIN": "1555",
        "deliveredQuantity_GMEIN": "0",
        "confirmedQuantity_GMEIN": "558",
        "unitOfMeasure_GMEIN": "PC",
        "batch": "B2973212J",
        "sequenceNumber": "",
        "createdOn": "0000-00-00",
        "orderType": "",
        "systemStatus": "",
        "enteredBy": "",
        "postingDate": "0000-00-00",
        "statusProfile": "",
        "insertedTimestamp": "2025-01-23 05:48:09",
        "insertedBy": "1",
        "forge_commite_week": null,
        "this_month_forge_qty": null,
        "plan_no_of_mc": null,
        "special_remarks": null,
        "rm_delivery_date": null,
        "advance_final_rm_wt": null,
        "rm_allocation_priority": null,
        "updated_by": null,
        "updated_at": null,
        "work_order": "B2973",
        "customer": "Against Open SO Dealer’s 1st priority",
        "reciving_date": "2023-05-24",
        "delivery_date": "2023-06-24",
        "wom_responsible_person_id": null,
        "wom_segment_id": "5",
        "finish": "2",
        "finish_wt": "193.00",
        "size": "M22",
        "prod_group": "153",
        "length": "40",
        "spec": "10B33",
        "rod_dia1": "22",
        "drawn_dia1": "20.00/20.05",
        "machine_id": "63",
        "module_id": "6",
        "seg2_id": "3",
        "seg3_id": "3",
        "machine_1_name": "254L-2",
        "machine_name": "254L",
        "machine_speed": "35",
        "no_of_mc": "1",
        "module_name": "BOLT-3",
        "sap_responsible_person_name": "Gaurav",
        "sap_segment_name": "DOM",
        "seg2_name": "ALLOY-HEX",
        "seg3_name": "ALLOY-BOLT",
        "to_forge_qty": 997,
        "to_forge_wt": 192.421,
        "to_forge_rm_wt": 230.90519999999998,
        "per_day_booking": null,
        "pending_form_outside": 230.90519999999998,
        "no_of_day_pending": 5,
        "allocated_product_wt": 0,
        "allocated_balance_rm_wt": 0,
        "allocated_product_qty": 0,
        "final_pending_qty": 997,
        "pending_qty": 997,
        "pending_wt": 192.421,
        "pending_rm_wt": 230.90519999999998,
        "this_month_forge_wt": 0,
        "this_month_forge_rm_wt": 0,
        "act_allocated_balance_rm_wt": 0,
        "per_of_efficiency": 60
    },
    {
        "id": "160",
        "orderNumber": "B2973",
        "plant": "MP01",
        "materialNumber": "107465J",
        "materialDescription": "SHCS M20X2.5X30 GR 12.9 F/T BLK",
        "orderQuantity_GMEIN": "5989",
        "deliveredQuantity_GMEIN": "0",
        "confirmedQuantity_GMEIN": "0",
        "unitOfMeasure_GMEIN": "PC",
        "batch": "B2973300J",
        "sequenceNumber": "",
        "createdOn": "0000-00-00",
        "orderType": "",
        "systemStatus": "",
        "enteredBy": "",
        "postingDate": "0000-00-00",
        "statusProfile": "",
        "insertedTimestamp": "2025-01-23 05:48:09",
        "insertedBy": "1",
        "forge_commite_week": null,
        "this_month_forge_qty": null,
        "plan_no_of_mc": null,
        "special_remarks": null,
        "rm_delivery_date": null,
        "advance_final_rm_wt": null,
        "rm_allocation_priority": null,
        "updated_by": null,
        "updated_at": null,
        "work_order": "B2973",
        "customer": "Against Open SO Dealer’s 1st priority",
        "reciving_date": "2023-05-24",
        "delivery_date": "2023-06-24",
        "wom_responsible_person_id": null,
        "wom_segment_id": "5",
        "finish": "2",
        "finish_wt": "128.00",
        "size": "M20",
        "prod_group": "190",
        "length": "30",
        "spec": "51B37",
        "rod_dia1": "22",
        "drawn_dia1": "19.50/19.55",
        "machine_id": "54",
        "module_id": "6",
        "seg2_id": "4",
        "seg3_id": "4",
        "machine_1_name": "204L-BOLT-3-1",
        "machine_name": "204L-BOLT-3",
        "machine_speed": "45",
        "no_of_mc": "2",
        "module_name": "BOLT-3",
        "sap_responsible_person_name": "Gaurav",
        "sap_segment_name": "DOM",
        "seg2_name": "SOC",
        "seg3_name": "SOC",
        "to_forge_qty": 5989,
        "to_forge_wt": 766.592,
        "to_forge_rm_wt": 919.9104,
        "per_day_booking": null,
        "pending_form_outside": 919.9104,
        "no_of_day_pending": 5,
        "allocated_product_wt": 0,
        "allocated_balance_rm_wt": 0,
        "allocated_product_qty": 0,
        "final_pending_qty": 5989,
        "pending_qty": 5989,
        "pending_wt": 766.592,
        "pending_rm_wt": 919.9104,
        "this_month_forge_wt": 0,
        "this_month_forge_rm_wt": 0,
        "act_allocated_balance_rm_wt": 0,
        "per_of_efficiency": 60
    },
    {
        "id": "160",
        "orderNumber": "B2973",
        "plant": "MP01",
        "materialNumber": "107465J",
        "materialDescription": "SHCS M20X2.5X30 GR 12.9 F/T BLK",
        "orderQuantity_GMEIN": "5989",
        "deliveredQuantity_GMEIN": "0",
        "confirmedQuantity_GMEIN": "0",
        "unitOfMeasure_GMEIN": "PC",
        "batch": "B2973300J",
        "sequenceNumber": "",
        "createdOn": "0000-00-00",
        "orderType": "",
        "systemStatus": "",
        "enteredBy": "",
        "postingDate": "0000-00-00",
        "statusProfile": "",
        "insertedTimestamp": "2025-01-23 05:48:09",
        "insertedBy": "1",
        "forge_commite_week": null,
        "this_month_forge_qty": null,
        "plan_no_of_mc": null,
        "special_remarks": null,
        "rm_delivery_date": null,
        "advance_final_rm_wt": null,
        "rm_allocation_priority": null,
        "updated_by": null,
        "updated_at": null,
        "work_order": "B2973",
        "customer": "Against Open SO Dealer’s 1st priority",
        "reciving_date": "2023-05-24",
        "delivery_date": "2023-06-24",
        "wom_responsible_person_id": null,
        "wom_segment_id": "5",
        "finish": "2",
        "finish_wt": "128.00",
        "size": "M20",
        "prod_group": "190",
        "length": "30",
        "spec": "51B37",
        "rod_dia1": "22",
        "drawn_dia1": "19.50/19.55",
        "machine_id": "54",
        "module_id": "6",
        "seg2_id": "4",
        "seg3_id": "4",
        "machine_1_name": "204L-BOLT-3-1",
        "machine_name": "204L-BOLT-3",
        "machine_speed": "45",
        "no_of_mc": "2",
        "module_name": "BOLT-3",
        "sap_responsible_person_name": "Gaurav",
        "sap_segment_name": "DOM",
        "seg2_name": "SOC",
        "seg3_name": "SOC",
        "to_forge_qty": 5989,
        "to_forge_wt": 766.592,
        "to_forge_rm_wt": 919.9104,
        "per_day_booking": null,
        "pending_form_outside": 919.9104,
        "no_of_day_pending": 5,
        "allocated_product_wt": 0,
        "allocated_balance_rm_wt": 0,
        "allocated_product_qty": 0,
        "final_pending_qty": 5989,
        "pending_qty": 5989,
        "pending_wt": 766.592,
        "pending_rm_wt": 919.9104,
        "this_month_forge_wt": 0,
        "this_month_forge_rm_wt": 0,
        "act_allocated_balance_rm_wt": 0,
        "per_of_efficiency": 60
    },
    {
        "id": "63",
        "orderNumber": "B2973",
        "plant": "MP01",
        "materialNumber": "290010J",
        "materialDescription": "NYLOCK NUT B/R M24X3 DIN985 CL10 ZC3",
        "orderQuantity_GMEIN": "4040",
        "deliveredQuantity_GMEIN": "0",
        "confirmedQuantity_GMEIN": "0",
        "unitOfMeasure_GMEIN": "PC",
        "batch": "B2973431J",
        "sequenceNumber": "",
        "createdOn": "0000-00-00",
        "orderType": "",
        "systemStatus": "",
        "enteredBy": "",
        "postingDate": "0000-00-00",
        "statusProfile": "",
        "insertedTimestamp": "2025-01-23 05:48:09",
        "insertedBy": "1",
        "forge_commite_week": null,
        "this_month_forge_qty": null,
        "plan_no_of_mc": null,
        "special_remarks": null,
        "rm_delivery_date": null,
        "advance_final_rm_wt": null,
        "rm_allocation_priority": null,
        "updated_by": null,
        "updated_at": null,
        "work_order": "B2973",
        "customer": "Against Open SO Dealer’s 1st priority",
        "reciving_date": "2023-05-24",
        "delivery_date": "2023-06-24",
        "wom_responsible_person_id": null,
        "wom_segment_id": "5",
        "finish": "8",
        "finish_wt": "120.00",
        "size": "M24",
        "prod_group": "169",
        "length": "-",
        "spec": "10B33",
        "rod_dia1": "32",
        "drawn_dia1": "31.45/31.50",
        "machine_id": "70",
        "module_id": "7",
        "seg2_id": "1",
        "seg3_id": "1",
        "machine_1_name": "41B6S-1",
        "machine_name": "41B6S",
        "machine_speed": "50",
        "no_of_mc": "1",
        "module_name": "NUT",
        "sap_responsible_person_name": "Byas",
        "sap_segment_name": "DOM",
        "seg2_name": "NUT",
        "seg3_name": "ALLOY-NUT",
        "to_forge_qty": 4040,
        "to_forge_wt": 484.8,
        "to_forge_rm_wt": 581.76,
        "per_day_booking": null,
        "pending_form_outside": 581.76,
        "no_of_day_pending": 5,
        "allocated_product_wt": 0,
        "allocated_balance_rm_wt": 0,
        "allocated_product_qty": 0,
        "final_pending_qty": 4040,
        "pending_qty": 4040,
        "pending_wt": 484.8,
        "pending_rm_wt": 581.76,
        "this_month_forge_wt": 0,
        "this_month_forge_rm_wt": 0,
        "act_allocated_balance_rm_wt": 0,
        "per_of_efficiency": 60
    },
    {
        "id": "54",
        "orderNumber": "C0635",
        "plant": "MP01",
        "materialNumber": "829225J",
        "materialDescription": "M06 FLAT WASHER ZC3 036600008AH",
        "orderQuantity_GMEIN": "100000",
        "deliveredQuantity_GMEIN": "0",
        "confirmedQuantity_GMEIN": "0",
        "unitOfMeasure_GMEIN": "PC",
        "batch": "C0635009J",
        "sequenceNumber": "",
        "createdOn": "0000-00-00",
        "orderType": "",
        "systemStatus": "",
        "enteredBy": "",
        "postingDate": "0000-00-00",
        "statusProfile": "",
        "insertedTimestamp": "2025-01-23 05:48:09",
        "insertedBy": "1",
        "forge_commite_week": null,
        "this_month_forge_qty": null,
        "plan_no_of_mc": null,
        "special_remarks": null,
        "rm_delivery_date": null,
        "advance_final_rm_wt": null,
        "rm_allocation_priority": null,
        "updated_by": null,
        "updated_at": null,
        "work_order": "C0635",
        "customer": "KAIZEN",
        "reciving_date": null,
        "delivery_date": "2023-04-25",
        "wom_responsible_person_id": null,
        "wom_segment_id": "1",
        "finish": "8",
        "finish_wt": "0.87",
        "size": "M06",
        "prod_group": "140",
        "length": "-",
        "spec": "C-45",
        "rod_dia1": "193X1.6",
        "drawn_dia1": "193X1.6",
        "machine_id": "64",
        "module_id": "2",
        "seg2_id": "2",
        "seg3_id": "2",
        "machine_1_name": "300T-1",
        "machine_name": "300T",
        "machine_speed": "50",
        "no_of_mc": "2",
        "module_name": "WASHER",
        "sap_responsible_person_name": "Satish",
        "sap_segment_name": "SPM",
        "seg2_name": "WASHER",
        "seg3_name": "ALLOY-WASHER",
        "to_forge_qty": 100000,
        "to_forge_wt": 87,
        "to_forge_rm_wt": 104.39999999999999,
        "per_day_booking": null,
        "pending_form_outside": 104.39999999999999,
        "no_of_day_pending": 5,
        "allocated_product_wt": 0,
        "allocated_balance_rm_wt": 0,
        "allocated_product_qty": 0,
        "final_pending_qty": 100000,
        "pending_qty": 100000,
        "pending_wt": 87,
        "pending_rm_wt": 104.39999999999999,
        "this_month_forge_wt": 0,
        "this_month_forge_rm_wt": 0,
        "act_allocated_balance_rm_wt": 0,
        "per_of_efficiency": 60
    }
  ];

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
      { label: 'Report' }
    ];
    this.filterForm = this.fb.group({
      module_name: [''],
      machine_1_name: ['']
    });
    this.getModules();
    this.onFilterChange();
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
    this.onFilterChange();
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
  onFilterChange() {
    console.log(this.filterForm.value);
    this.loadingReport = true;
    let moduleIds;
    let machineRevIds;
    if(this.filterForm.value.module_name || this.filterForm.value.machine_1_name){
      moduleIds = this.filterForm.get('module_name')?.value.map(val=>val.id);
      machineRevIds = this.filterForm.get('machine_1_name')?.value;
    } else{
      moduleIds = this.filterForm.value.module_name;
      machineRevIds = this.filterForm.value.machine_1_name;
    }
    this.adminApiService.machineWiseModuleWiseMonthlyReport2({moduleIds, machineRevIds}).subscribe({
      next: (res) => {
        this.loadingReport = false;
        console.log(res.data)
        this.data = res.data.map((val: any)=> {
          return this.unbrakoPPCommonService.SAPMainFileMapping(val);
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
        });
        console.log(this.data)
        // this.updateFilteredData();
        // Create pivot data based on grouping by prod_group, size, spec
        // this.pivotData = this.createPivot(this.data);
        // this.pivotData = this.summingOfSPEC(this.data);
        this.pivotData = this.processData(this.data);
        console.log(this.pivotData)
        const fileName = 'Pivot Data';
        // this.excelService.generateExcelFile(fileName, this.data);
      },
      error: (err) => {
        this.loadingReport = false;
        console.error(err);
      }
    });
  }

  processData(data) {
    let groupedData = [];
    let currentModule = null;
    let totalPendingQty = 0;
    let moduleGroup = [];

    data.forEach((item, index) => {
        if (currentModule === null || item.module_id === currentModule) {
            moduleGroup.push(item);
            totalPendingQty += item.pending_qty;
        } else {
            groupedData.push(...moduleGroup);
            groupedData.push({
                module_id: "TOTAL",
                module_name: "Total",
                machine_1_name: "",
                pending_qty: totalPendingQty
            });
            moduleGroup = [item];
            totalPendingQty = item.pending_qty;
        }
        currentModule = item.module_id;
    });

    if (moduleGroup.length > 0) {
        groupedData.push(...moduleGroup);
        groupedData.push({
            module_id: "TOTAL",
            module_name: "Total",
            machine_1_name: "",
            pending_qty: totalPendingQty
        });
    }

    return groupedData;
  }

  // Function to aggregate data and format it into a pivot table-like structure
  updateFilteredData() {
    let filteredData = [...this.data];
    console.log([...this.data])
    const moduleNames = this.filterForm.get('module_name')?.value.map(val=>val.id);
    const machineNames = this.filterForm.get('machine_1_name')?.value;
    console.log(moduleNames);
    console.log(machineNames)
    // Apply filters
    if (moduleNames) {
      // filteredData = filteredData.filter(item => item.module_name === moduleNames);
      // filteredData = filteredData.filter(item => item.module_id === moduleNames);
      filteredData = filteredData.filter(item => moduleNames.includes(item.module_id));
    }
    if (machineNames && machineNames.length > 0) {
      // filteredData = filteredData.filter(item => machineNames.includes(item.machine_1_name));
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
      if (!group.machines[item.machine_1_name]) {
        group.machines[item.machine_1_name] = {
          to_forge_qty: 0,
          to_forge_wt: 0,
          to_forge_rm_wt: 0
        };
      }

      group.machines[item.machine_1_name].to_forge_qty += item.to_forge_qty;
      group.machines[item.machine_1_name].to_forge_wt += item.to_forge_wt;
      group.machines[item.machine_1_name].to_forge_rm_wt += item.to_forge_rm_wt;
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
        const key = `${entry.prod_group || "null"}|${entry.size}|${entry.spec}`;

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
            to_forge_qty: groupedData[key].to_forge_qty.toFixed(2),
            to_forge_wt: groupedData[key].to_forge_wt.toFixed(2),
            to_forge_rm_wt: groupedData[key].to_forge_rm_wt.toFixed(2),
            is_total: true
        });
    });

    // Output result
    // console.log(JSON.stringify(finalData, null, 4));
    return finalData;
  }

}
