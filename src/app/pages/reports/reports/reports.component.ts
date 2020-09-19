import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  years: number[] = [];

  constructor() { }

  ngOnInit(): void {
    this.getYears();
  }

  private getYears() {
    const currentYear: number = (new Date()).getFullYear();

    for (let index = currentYear - 5; index <= currentYear; index++) {
      this.years.push(index);
    }

    this.years.sort((a,b) => b - a);
  }

}
