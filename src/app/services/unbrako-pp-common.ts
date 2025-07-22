import { Injectable } from '@angular/core';

interface WeeklyPeriod { week_number: number, start_date: Date, end_date: Date };

@Injectable({
  providedIn: 'root'
})
export class UnbrakoPPCommonService {
  currentWeek:  WeeklyPeriod | null = null;
  weeklyPeriods: WeeklyPeriod[];
  // weeklyPeriods: WeeklyPeriod[] = [
  //   { week_number: 1, start_date: new Date('2025-01-06'), end_date: new Date('2025-01-11') },
  //   { week_number: 2, start_date: new Date('2025-01-13'), end_date: new Date('2025-01-18') },
  //   { week_number: 3, start_date: new Date('2025-01-20'), end_date: new Date('2025-01-25') },
  //   { week_number: 4, start_date: new Date('2025-01-27'), end_date: new Date('2025-02-01') },
  //   { week_number: 5, start_date: new Date('2025-02-03'), end_date: new Date('2025-02-08') },
  //   { week_number: 6, start_date: new Date('2025-02-10'), end_date: new Date('2025-02-15') },
  //   { week_number: 7, start_date: new Date('2025-02-17'), end_date: new Date('2025-02-22') },
  //   { week_number: 8, start_date: new Date('2025-02-24'), end_date: new Date('2025-03-01') },
  //   { week_number: 9, start_date: new Date('2025-03-03'), end_date: new Date('2025-03-08') },
  //   { week_number: 10, start_date: new Date('2025-03-10'), end_date: new Date('2025-03-15') },
  //   { week_number: 11, start_date: new Date('2025-03-17'), end_date: new Date('2025-03-22') },
  //   { week_number: 12, start_date: new Date('2025-03-24'), end_date: new Date('2025-03-29') },
  //   { week_number: 13, start_date: new Date('2025-03-31'), end_date: new Date('2025-04-05') },
  //   { week_number: 14, start_date: new Date('2025-04-07'), end_date: new Date('2025-04-12') },
  //   { week_number: 15, start_date: new Date('2025-04-14'), end_date: new Date('2025-04-19') },
  //   { week_number: 16, start_date: new Date('2025-04-21'), end_date: new Date('2025-04-26') },
  //   { week_number: 17, start_date: new Date('2025-04-28'), end_date: new Date('2025-05-03') },
  //   { week_number: 18, start_date: new Date('2025-05-05'), end_date: new Date('2025-05-10') },
  //   { week_number: 19, start_date: new Date('2025-05-12'), end_date: new Date('2025-05-17') },
  //   { week_number: 20, start_date: new Date('2025-05-19'), end_date: new Date('2025-05-24') },
  //   { week_number: 21, start_date: new Date('2025-05-26'), end_date: new Date('2025-05-31') },
  //   { week_number: 22, start_date: new Date('2025-06-02'), end_date: new Date('2025-06-07') },
  //   { week_number: 23, start_date: new Date('2025-06-09'), end_date: new Date('2025-06-14') },
  //   { week_number: 24, start_date: new Date('2025-06-16'), end_date: new Date('2025-06-21') },
  //   { week_number: 25, start_date: new Date('2025-06-23'), end_date: new Date('2025-06-28') },
  //   { week_number: 26, start_date: new Date('2025-06-30'), end_date: new Date('2025-07-05') },
  //   { week_number: 27, start_date: new Date('2025-07-07'), end_date: new Date('2025-07-12') },
  //   { week_number: 28, start_date: new Date('2025-07-14'), end_date: new Date('2025-07-19') },
  //   { week_number: 29, start_date: new Date('2025-07-21'), end_date: new Date('2025-07-26') },
  //   { week_number: 30, start_date: new Date('2025-07-28'), end_date: new Date('2025-08-02') },
  //   { week_number: 31, start_date: new Date('2025-08-04'), end_date: new Date('2025-08-09') },
  //   { week_number: 32, start_date: new Date('2025-08-11'), end_date: new Date('2025-08-16') },
  //   { week_number: 33, start_date: new Date('2025-08-18'), end_date: new Date('2025-08-23') },
  //   { week_number: 34, start_date: new Date('2025-08-25'), end_date: new Date('2025-08-30') },
  //   { week_number: 35, start_date: new Date('2025-09-01'), end_date: new Date('2025-09-06') },
  //   { week_number: 36, start_date: new Date('2025-09-08'), end_date: new Date('2025-09-13') },
  //   { week_number: 37, start_date: new Date('2025-09-15'), end_date: new Date('2025-09-20') },
  //   { week_number: 38, start_date: new Date('2025-09-22'), end_date: new Date('2025-09-27') },
  //   { week_number: 39, start_date: new Date('2025-09-29'), end_date: new Date('2025-10-04') },
  //   { week_number: 40, start_date: new Date('2025-10-06'), end_date: new Date('2025-10-11') },
  //   { week_number: 41, start_date: new Date('2025-10-13'), end_date: new Date('2025-10-18') },
  //   { week_number: 42, start_date: new Date('2025-10-20'), end_date: new Date('2025-10-25') },
  //   { week_number: 43, start_date: new Date('2025-10-27'), end_date: new Date('2025-11-01') },
  //   { week_number: 44, start_date: new Date('2025-11-03'), end_date: new Date('2025-11-08') },
  //   { week_number: 45, start_date: new Date('2025-11-10'), end_date: new Date('2025-11-15') },
  //   { week_number: 46, start_date: new Date('2025-11-17'), end_date: new Date('2025-11-22') },
  //   { week_number: 47, start_date: new Date('2025-11-24'), end_date: new Date('2025-11-29') },
  //   { week_number: 48, start_date: new Date('2025-12-01'), end_date: new Date('2025-12-06') },
  //   { week_number: 49, start_date: new Date('2025-12-08'), end_date: new Date('2025-12-13') },
  //   { week_number: 50, start_date: new Date('2025-12-15'), end_date: new Date('2025-12-20') },
  //   { week_number: 51, start_date: new Date('2025-12-22'), end_date: new Date('2025-12-27') },
  //   { week_number: 52, start_date: new Date('2025-12-29'), end_date: new Date('2026-01-03') }
  // ];

  generateWeeklyPeriods(): WeeklyPeriod[] {
    const year = new Date().getFullYear(); // get current year
    const weeklyPeriods: WeeklyPeriod[] = [];
    let start = new Date(year, 0, 1);

    // Move to the first Monday of the year
    while (start.getDay() !== 1) {
      start.setDate(start.getDate() + 1);
    }

    let week = 1;
    while (start.getFullYear() <= year) {
      const end = new Date(start);
      end.setDate(start.getDate() + 5); // Monday to Saturday

      weeklyPeriods.push({
        week_number: week++,
        start_date: new Date(start),
        end_date: new Date(end),
      });

      // Move to next Monday
      start.setDate(start.getDate() + 7);
    }
    this.weeklyPeriods = weeklyPeriods;
    return weeklyPeriods;
  }


  weekStringRepr(week: WeeklyPeriod) {
    const startDate = week.start_date.toLocaleDateString('en-GB'); // Formats as "dd/mm/yyyy"
    const endDate = week.end_date.toLocaleDateString('en-GB');

    return `${week.week_number}: ${startDate.replace(/\//g, '-')} To ${endDate.replace(/\//g, '-')}`;
  }

  constructor() {}

  getModuleMultipler(module_id: any){
    if(module_id == 2){
      return 2.2;
    } else if(module_id == 9) {
      return 1.3;
    } else {
      return 1.2;
    }
  }

  normalizeDate(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  /**
   * Get the current week number based on today's date
   */
  getCurrentWeekNumber():  WeeklyPeriod | null {
    // const today = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD
    const today = this.normalizeDate(new Date());

    const currentWeek : WeeklyPeriod | boolean = this.generateWeeklyPeriods().find((week: WeeklyPeriod) =>{
      const start = this.normalizeDate(week.start_date);
      const end = this.normalizeDate(week.end_date);
      return today >= start && today <= end
    });
    if(currentWeek){
      this.currentWeek = currentWeek
    }
    return currentWeek ? currentWeek : null; // Return 0 if not found
  }

  // getCurrentWeekNumber(date: Date = new Date()): number {
  //   let tempDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  //   let startOfYear = new Date(tempDate.getFullYear(), 0, 1);
  //   let diffInDays = Math.floor((tempDate.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));

  //   return Math.ceil((diffInDays + startOfYear.getDay() + 1) / 7);
  // }

  groupMachines(data: any){
    return data.reduce((acc, curr) => {
      let group = acc.find(item => item.label === curr.machine_name);
      if (!group) {
        group = { label: curr.machine_name, value: curr.machine_id, items: [] };
        acc.push(group);
      }
      group.items.push({ label: curr.machine_rev, value: curr.rev_id });
      return acc;
    }, []);
  }

  SAPMainFileMapping(row: any){
    const to_forge_qty: number = (+row.orderQuantity_GMEIN - (+row.confirmedQuantity_GMEIN)); //--
    // const to_forge_qty: number = +row.to_forge; //--
    const to_forge_wt: number = (to_forge_qty * row.finish_wt)/1000; //--
    const to_forge_rm_wt: number = +to_forge_wt * this.getModuleMultipler(row.module_id); //--
    const this_month_forge_wt = (row.forged_so_far * row.finish_wt)/1000; //--this_month_forge_qty is forged_so_far
    const this_month_forge_rm_wt = this_month_forge_wt * this.getModuleMultipler(row.module_id); //--

    const act_allocated_balance_rm_wt = this_month_forge_rm_wt >= row.advance_final_rm_wt ? 0 : row.advance_final_rm_wt-this_month_forge_rm_wt; //--
    const allocated_balance_rm_wt = act_allocated_balance_rm_wt == 0 ? 0 : act_allocated_balance_rm_wt; //--
    const allocated_product_wt = +allocated_balance_rm_wt/+this.getModuleMultipler(row.module_id);  // --

    const per_of_efficiency = 60; // --
    const per_day_booking = +(+row.machine_speed*450)*(per_of_efficiency/100)*row.no_of_shift*(+row.plan_no_of_machine); // --
    const final_pending_qty = to_forge_qty - row.forged_so_far; // --this_month_forge_qty is forged_so_far
    const allocated_product_qty: number = row.finish_wt ? (+allocated_product_wt*1000)/+row.finish_wt : 0; // --
    const pending_form_outside = to_forge_rm_wt-row.advance_final_rm_wt; // --

    // const no_of_day_pending = Date()-Date(row.delivery_date) ; // --
    const no_of_day_pending = 5; // --

    const no_of_days_booking = (final_pending_qty === 0 || final_pending_qty < 0) ? 0 : per_day_booking ? final_pending_qty / per_day_booking : 0;
    const no_of_day_weekly_planning = (allocated_product_qty === 0 || allocated_product_qty < 0 ) ? 0 : allocated_product_qty/per_day_booking;
    
    const pending_qty = final_pending_qty <= 0 ? 0 : final_pending_qty ; // --
    const pending_wt = (+pending_qty * row.finish_wt) / 1000
    const pending_rm_wt = pending_wt*this.getModuleMultipler(row.module_id);
    
    return {...row, 
      to_forge_qty: to_forge_qty,
      to_forge_wt: parseFloat(to_forge_wt.toFixed(2)),
      to_forge_rm_wt:parseFloat(to_forge_rm_wt.toFixed(2)),
      per_day_booking: per_day_booking,
      no_of_days_booking:no_of_days_booking,
      no_of_day_weekly_planning:no_of_day_weekly_planning,
      pending_form_outside: pending_form_outside.toFixed(2),
      no_of_day_pending: no_of_day_pending,
      allocated_product_wt: allocated_product_wt,
      allocated_balance_rm_wt: allocated_balance_rm_wt,
      allocated_product_qty: allocated_product_qty,
      final_pending_qty: final_pending_qty,
      pending_qty: pending_qty,
      pending_wt: pending_wt,
      pending_rm_wt: pending_rm_wt.toFixed(2),
      
      this_month_forge_wt: this_month_forge_wt,
      this_month_forge_rm_wt: this_month_forge_rm_wt,
      act_allocated_balance_rm_wt: act_allocated_balance_rm_wt,
      per_of_efficiency: per_of_efficiency,
    }
  }
}
