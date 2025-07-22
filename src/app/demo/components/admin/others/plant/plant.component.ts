import { Component, OnInit } from '@angular/core';

import { AdminApiService } from 'src/app/services/adminapi.service';

@Component({
  selector: 'app-plant',
  templateUrl: './plant.component.html',
  styleUrl: './plant.component.scss'
})
export class PlantComponent implements OnInit {
  plants!: any;
  loadingPlant: boolean = false;

  constructor(
    private adminApiService: AdminApiService
  ){}

  ngOnInit(): void {
    this.load_plant_data();
  }

  load_plant_data(){
    this.loadingPlant = true;
    this.adminApiService.get_all_plant().subscribe({
      next: (res: any)=>{
        this.plants = res.data;
        this.loadingPlant = false;
      }, 
      error: (err: any)=>{
        this.loadingPlant = false;
      }
    });
  }
}
