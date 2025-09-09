import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantService {
  constructor() { }

  readonly ADMIN = 'ADMIN';
  readonly USER = 'USER';
  readonly PLANNER = 'PLANNER';
  readonly MASTER = 'MASTER';
  readonly VIEWER = 'VIEWER';

  // You can also group roles if needed
  readonly ALL_ROLES = [this.ADMIN, this.USER, this.PLANNER, this.MASTER, this.VIEWER];
}
