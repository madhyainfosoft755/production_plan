
import { Injectable } from '@angular/core';
import { HttpHeaders} from '@angular/common/http';
import { HttpService } from './http.service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AdminApiService {
  baseUrl: string = environment.apiBaseURL+'api/';

  constructor(
    private http: HttpService
  ) { }
  
  // headers = new HttpHeaders({
  //   'Content-Type': 'application/json',
  // });

  // getCookie(name: string): string | null {
  //   const value = `; ${document.cookie}`;
  //   const parts = value.split(`; ${name}=`);
  //   if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  //   return null;
  // }


  // // Retrieve the CSRF token from the cookie
  // csrftoken: any = this.getCookie('csrftoken');
  // if (csrftoken: any) {
  //   this.headers.append('X-CSRFToken', csrftoken);
  // }
  
  get_work_order_master(filters=null,page=1): Observable<any>{
    return this.http.post(`${this.baseUrl}work-order-master?page=${page}`, filters);
  }

  download_wom_template(): Observable<any>{
    return this.http.getBlob(`${this.baseUrl}download-wom-template`);
  }

  download_sap_template(): Observable<any>{
    return this.http.getBlob(`${this.baseUrl}download-sap-template`);
  }

  download_pm_template(): Observable<any>{
    return this.http.getBlob(`${this.baseUrl}download-pm-template`);
  }

  get_machine_master(filters=null,page=1): Observable<any>{
    return this.http.post(`${this.baseUrl}machine-master?page=${page}`, filters);
  }

  get_sap_data(filters=null,page=1): Observable<any>{
    return this.http.post(`${this.baseUrl}get-sap-data?page=${page}`, filters);
  }

  get_sap_rm_data(sap_id: string): Observable<any>{
    return this.http.post(`${this.baseUrl}get-sap-rm-data`, {sap_id});
  }

  update_sap_rm_data(data: any): Observable<any>{
    return this.http.post(`${this.baseUrl}update-sap-rm-data`, data);
  }

  load_sap_filters(): Observable<any>{
    return this.http.get(`${this.baseUrl}load-sap-filters`);
  }

  add_new_machine_master(data: any): Observable<any>{
    return this.http.post(`${this.baseUrl}add-machine-master`, data);
  }

  update_sap_data(id: string, data: any): Observable<any>{
    return this.http.post(`${this.baseUrl}sap-data/update/${id}`, data);
  }

  update_buld_admin_fields(data: any): Observable<any>{
    return this.http.post(`${this.baseUrl}update-buld-admin-fields`, data);
  }

  update_to_forge(id: string, data: any): Observable<any>{
    return this.http.post(`${this.baseUrl}update-to-forge/${id}`, data);
  }
  update_weekly_forge_planning(id: string, data: any): Observable<any>{
    return this.http.post(`${this.baseUrl}update-weekly-forge/${id}`, data);
  }
  update_forged_today(id: string, data: any): Observable<any>{
    return this.http.post(`${this.baseUrl}update-forged-so-far/${id}`, data);
  }

  get_all_customers(): Observable<any>{
    return this.http.get(`${this.baseUrl}customers`);
  }

  get_all_product_master(filters=null,page=1): Observable<any>{
    return this.http.post(`${this.baseUrl}product-master?page=${page}`, filters);
  }

  get_all_machines(): Observable<any>{
    return this.http.get(`${this.baseUrl}machines`);
  }

  get_machines(): Observable<any>{
    return this.http.get(`${this.baseUrl}all-machines`);
  }

  get_machines_info(): Observable<any>{
    return this.http.get(`${environment.apiBaseURL+'masters/'}machines-info`);
  }

  get_machine_info(id: string): Observable<any>{
    return this.http.get(`${this.baseUrl}machines/${id}`);
  }

  get_material_no_info(mat_num: string): Observable<any>{
    return this.http.get(`${environment.apiBaseURL+'masters/'}material-number-info/${mat_num}`);
  }

  add_machine(data: any): Observable<any>{
    return this.http.post(`${this.baseUrl}machines`, data);
  }

  update_machine(id: string, data: any): Observable<any>{
    return this.http.put(`${this.baseUrl}machines/${id}`, data);
  }

  get_all_plant(): Observable<any>{
    return this.http.get(`${this.baseUrl}plant`);
  }

  get_all_finish(): Observable<any>{
    return this.http.get(`${this.baseUrl}finish`);
  }

  get_surface_treatment_process(): Observable<any>{
    return this.http.get(`${this.baseUrl}surface-treatment-process`);
  }

  get_master_template_passwords(): Observable<any>{
    return this.http.get(`${this.baseUrl}get-master-template-passwords`);
  }

  loadSAPFilterSuggestions(): Observable<any>{
    return this.http.get(`${this.baseUrl}load-sap-filter-suggestions`);
  }

  add_customer(data: any): Observable<any>{
    return this.http.post(`${this.baseUrl}customers`, data);
  }

  add_new_plant(data: any): Observable<any>{
    return this.http.post(`${this.baseUrl}plant`, data);
  }

  add_new_work_order(data: any): Observable<any>{
    return this.http.post(`${this.baseUrl}add-work-order-master`, data);
  }

  upload_sap(data: any): Observable<any>{
    return this.http.post(`${this.baseUrl}transfer-and-upload`, data);
  }

  upload_wom(data: any): Observable<any>{
    return this.http.post(`${this.baseUrl}import/work-order-master-file`, data);
  }

  upload_pm(data: any): Observable<any>{
    return this.http.post(`${this.baseUrl}import/product-master-file`, data);
  }

  addProductMaster(data: any): Observable<any>{
    return this.http.post(`${this.baseUrl}add-product-master`, data);
  }

  getMachineModules(machine_rev_id: string): Observable<any>{
    return this.http.get(`${this.baseUrl}get-machine-modules/${machine_rev_id}`);
  }

  get_all_wo_db_and_finish(): Observable<any>{
    return this.http.get(`${this.baseUrl}get-all-wo-db-and-finish`);
  }

  checkPartNumber(partNumber: any): Observable<any>{
    return this.http.get(`${this.baseUrl}check-part-number/${partNumber}`);
  }

  add_part_number_sap(id: number, data: any): Observable<any>{
    return this.http.post(`${this.baseUrl}add-part-number-sap/${id}`, data);
  }

  getMachineForModules(moduleIds: any[]): Observable<any>{
    return this.http.post(`${this.baseUrl}get-machine-for-modules`, {moduleIds: moduleIds});
  }

  machineWiseModuleWiseMonthlyReport(data: any): Observable<any>{
    return this.http.post(`${this.baseUrl}m-w-m-w-m-report`, data);
  }

  machineWiseModuleWiseMonthlyReport2(data: any): Observable<any>{
    return this.http.post(`${this.baseUrl}m-w-m-w-m-report2`, data);
  }

  get_all_employees(): Observable<any>{
    return this.http.get(`${this.baseUrl}users`);
  }

  add_finish(data: any): Observable<any>{
    return this.http.post(`${this.baseUrl}finish`, data);
  }

  add_surface_treatment_process(data: any): Observable<any>{
    return this.http.post(`${this.baseUrl}surface-treatment-process`, data);
  }

  add_seg3(data: any): Observable<any>{
    return this.http.post(`${this.baseUrl}seg3`, data);
  }

  get_all_seg3(): Observable<any>{
    return this.http.get(`${this.baseUrl}seg3`);
  }

  add_seg2(data: any): Observable<any>{
    return this.http.post(`${this.baseUrl}seg2`, data);
  }

  get_all_seg2(): Observable<any>{
    return this.http.get(`${this.baseUrl}seg2`);
  }

  add_segments(data: any): Observable<any>{
    return this.http.post(`${this.baseUrl}segments`, data);
  }

  get_all_segments(): Observable<any>{
    return this.http.get(`${this.baseUrl}segments`);
  }

  getWorkOrderFileUploadStatus(): Observable<any>{
    return this.http.get(`${this.baseUrl}get-work-order-file-upload-status`);
  }

  getPMFileUploadStatus(): Observable<any>{
    return this.http.get(`${this.baseUrl}get-product-master-file-upload-status`);
  }

  getWorkOrderFailedRecords(): Observable<any>{
    return this.http.getBlob(`${this.baseUrl}get-work-order-failed-records`);
  }

  getPMFailedRecords(): Observable<any>{
    return this.http.getBlob(`${this.baseUrl}get-product-master-failed-records`);
  }

  getSAPFailedRecords(): Observable<any>{
    return this.http.getBlob(`${this.baseUrl}get-sap-failed-records`);
  }

  validateWOMFile(): Observable<any>{
    return this.http.get(`${this.baseUrl}validate-wom-file`);
  }
  validateSAPFile(): Observable<any>{
    return this.http.get(`${this.baseUrl}validate-sap-file`);
  }

  getSAPFileStatus(): Observable<any>{
    return this.http.get(`${this.baseUrl}get-sap-file-status`);
  }

  validatePMFile(): Observable<any>{
    return this.http.get(`${this.baseUrl}validate-pm-file`);
  }

  get_all_customer_names(query: string): Observable<any>{
    return this.http.get(`${this.baseUrl}customer-names/${query}`);
  }

  get_all_shifts(): Observable<any>{
    return this.http.get(`${this.baseUrl}shifts`);
  }

  get_all_roles(): Observable<any>{
    return this.http.get(`${this.baseUrl}roles`);
  }

  add_modules(data: any): Observable<any>{
    return this.http.post(`${this.baseUrl}modules`, data);
  }

  completeWeeklyReportForMoudle(data: {module_id: number}): Observable<any>{
    return this.http.post(`${this.baseUrl}complete-weekly-report-for-module`, data);
  }

  updateWeeklyReportFields(data): Observable<any>{
    return this.http.post(`${this.baseUrl}update-weekly-report-fields`, data);
  }

  get_all_modules(): Observable<any>{
    return this.http.get(`${this.baseUrl}modules`);
  }

  get_temp_module_shift_data(): Observable<any>{
    return this.http.get(`${this.baseUrl}get-temp-module-shift-data2`);
  }

  get_temp_saved_module_shift_data(): Observable<any>{
    return this.http.get(`${this.baseUrl}get-temp-module-shift-data`);
  }

  save_daily_data(data: any): Observable<any>{
    return this.http.post(`${this.baseUrl}save-daily-data`, data);
  }

  weeklyPlanningData(data: any): Observable<any>{
    return this.http.post(`${this.baseUrl}get-weekly-planning`, data);
  }

  submit_daily_data(data: any): Observable<any>{
    return this.http.get(`${this.baseUrl}submit-daily-data`);
  }

  get_all_machines_with_part_numbers(module_id: string): Observable<any>{
    return this.http.post(`${this.baseUrl}get-all-machines-with-part-numbers`, {module_id: module_id});
  }

  add_groups(data: any): Observable<any>{
    return this.http.post(`${this.baseUrl}groups`, data);
  }

  get_all_groups(): Observable<any>{
    return this.http.get(`${this.baseUrl}groups`);
  }


  register(data: any): Observable<any>{
    return this.http.post(`${this.baseUrl}register/`, data);
  }

  forgot_password(data: {email: string}): Observable<any>{
    return this.http.post(`${this.baseUrl}forgot-password/`, data);
  }

  check_reset_token(token: string): Observable<any>{
    return this.http.get(`${this.baseUrl}check-reset-token/${token}`);
  }

  reset_password(data: {token: any, password: string}): Observable<any>{
    return this.http.post(`${this.baseUrl}reset-password/`, data);
  }

  change_password(data: any): Observable<any>{
    return this.http.post(`${this.baseUrl}change-password/`, data);
  }

  profile(): Observable<any>{
    return this.http.get(`${this.baseUrl}user`);
  }
  
  

}