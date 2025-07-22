import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantService {
  constructor() { }

  readonly ADMIN = 'ADMIN';
  readonly FORGING = 'FORGING';
  readonly HEATING = 'HEATING';
  readonly FINISH = 'FINISH';
  readonly RM = 'RM';

  // You can also group roles if needed
  readonly ALL_ROLES = [this.ADMIN, this.FORGING, this.HEATING, this.FINISH, this.RM];
}
