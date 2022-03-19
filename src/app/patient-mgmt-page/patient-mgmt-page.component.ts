import { Component, OnInit } from '@angular/core';
import { delay, map, of } from 'rxjs';
import { DataService } from '../data.service';

@Component({
  selector: 'app-patient-mgmt-page',
  templateUrl: './patient-mgmt-page.component.html',
  styleUrls: ['./patient-mgmt-page.component.css']
})
export class PatientMgmtPageComponent implements OnInit {

  pageTitle: string = 'Patient Management';
  patientList: any = [];  
  searchBarPlaceholder: string = 'Search by date, name, barcode, separate multiple search criteria with \':\'';
  circleOrg: boolean = false;
  
  entriesPerPage: number = 15;
  currentPage: number = 1;
  paginatedList: any = [];
  entriesInCurrentPage: number = this.paginatedList.length;

  constructor(private data: DataService) { }

  ngOnInit(): void {        
    this.hitService();
    this.data.orgName.subscribe((data) => {
      this.circleOrg = data.toLowerCase() === 'circle' ? true : false;      
    });
    this.pagination(this.currentPage);
  }

  pagination(page: number) {    
    this.paginatedList = [];
    let startValue = (page - 1) * this.entriesPerPage;
    let endValue = page * this.entriesPerPage;
    for (let i = startValue; i < endValue; i++) {
      if(!this.patientList[i]){break;}
      this.paginatedList.push(this.patientList[i]);
    }
    this.entriesInCurrentPage = this.paginatedList.length;    
  }

  changePage(change: number){
    this.currentPage += change==1? 1 : -1;
    this.pagination(this.currentPage);
  }

  hitService() {    
    this.data.getData()
      .subscribe((response: any) => {
        this.patientList = response;
        this.pagination(this.currentPage);
      },(error)=>{
        console.log(error);
      });
  }

  searchThisValue(event: any) {    
    let searchedValue = of(event.target.value);    
    searchedValue
      .pipe(
        delay(1000),              
        map((searchVal) => {          
          this.hitService();
          if (searchVal) {
            let criteria = searchVal.split(':');
            this.patientList = this.patientList.filter(
              (m: any) => {                
                let barcode = m.barcode.toLowerCase();
                let activateTime = m.activationTime.split(' ')[0];
                let resultTime = m.resultTime.split(' ')[0];
                let firstName = m.name.toLowerCase().split(' ')[0];
                let lastName = m.name.toLowerCase().split(' ')[1];
                let result = m.result.toLowerCase();
                let patientId = this.circleOrg ? m.patientId.toLowerCase() : undefined;
                for (let x = 0; x < criteria.length; x++) {                  
                  const value = criteria[x].toLowerCase().trim();                  
                  if (value == barcode ||
                    value == activateTime ||
                    value == resultTime ||
                    value == firstName ||
                    value == lastName ||
                    value == result ||
                    value == patientId) {
                    if (x == criteria.length - 1) {
                      return m;
                    }
                  } else {
                    break;
                  }
                }
              }
            );
          }
          return this.patientList;
        })
      ).subscribe(data => {        
        this.patientList = data
        this.pagination(this.currentPage);
      });      
  }

}
