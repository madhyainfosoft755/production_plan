import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rm-history',
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent implements OnInit {
  breadcrumbItems: any[];

  ngOnInit() :void {
    this.breadcrumbItems = [
      { label: 'Home', routerLink: '/' },
      { label: 'Main File History' }
    ];
  }

}
