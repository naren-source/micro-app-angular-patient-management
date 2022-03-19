import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  orgName: string = 'Prenetics'

  constructor(private data: DataService) { }

  ngOnInit(): void {
    this.data.getOrgs();
  }

  toggleOrgName() {
    this.orgName = this.orgName==='Prenetics'? 'Circle' : 'Prenetics';
    this.data.setOrgName(this.orgName);
  }
}
