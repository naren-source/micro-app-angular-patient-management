import { async, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DataService } from '../data.service';
import { PatientMgmtPageComponent } from './patient-mgmt-page.component';


describe('AppComponent', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [
        PatientMgmtPageComponent
      ],
    });
  });

  it('should create the component', () => {
    let patientComponent = TestBed.createComponent(PatientMgmtPageComponent);
    const instance = patientComponent.debugElement.componentInstance;
    expect(instance).toBeTruthy();
  });

  it(`should have as page title 'Patient Management'`, () => {
    let patientComponent = TestBed.createComponent(PatientMgmtPageComponent);
    const instance = patientComponent.debugElement.componentInstance;
    expect(instance.pageTitle).toEqual('Patient Management');
  });

  it('should get patient list details once we hit the api service calling method', async(() => {    
    let resultData = [{
      barcode: 'b66df241',
      activationTime: '2021-07-12 16:00:00',
      resultTime: '2021-07-12 16:00:00',
      name: 'Peter Chan',
      result: 'negative',
      resulType: 'rtpcr',
      patientId: '12345678901'
    }];
    let patientComponent = TestBed.createComponent(PatientMgmtPageComponent);
    let instance = patientComponent.debugElement.componentInstance;
    let dataService = patientComponent.debugElement.injector.get(DataService);    
    let spy = spyOn(dataService, 'getData').and.returnValue(of(resultData));
    instance.hitService();    
    patientComponent.whenStable().then(() => {      
      expect(instance.patientList).toBe(resultData);
    });
  }));

  it(`should have as search field place holder name as given`, () => {
    let patientComponent = TestBed.createComponent(PatientMgmtPageComponent);
    let instance = patientComponent.debugElement.componentInstance;  
    expect(instance.searchBarPlaceholder).toEqual('Search by date, name, barcode, separate multiple search criteria with \':\'');
  });

  it('should have the organisation flag default value as false and should switch on receiving data from service', async(()=>{
    let userComponent = TestBed.createComponent(PatientMgmtPageComponent);
    let instance = userComponent.debugElement.componentInstance;
    expect(instance.circleOrg).toBe(false);
    let dataService = userComponent.debugElement.injector.get(DataService);        
    dataService.setOrgName('Circle');    
    userComponent.detectChanges();
    userComponent.whenStable().then(()=>{      
      expect(instance.circleOrg).toBe(true);
    });      
  }));

  it(`should have entries Per Page value as 15 `, () => {
    let patientComponent = TestBed.createComponent(PatientMgmtPageComponent);
    let instance = patientComponent.debugElement.componentInstance;
    patientComponent.detectChanges();
    expect(instance.entriesPerPage).toEqual(15);
  });

  it(`should paginate the complete patient list after change detection `, () => {
    let patientComponent = TestBed.createComponent(PatientMgmtPageComponent);
    let instance = patientComponent.debugElement.componentInstance;    
    expect(instance.paginatedList.length).toEqual(0);
    patientComponent.detectChanges();
    expect(instance.entriesInCurrentPage<=instance.entriesPerPage).toBeTrue();
  });

  it('should change the page based on value passed', ()=>{
    let patientComponent = TestBed.createComponent(PatientMgmtPageComponent);
    let instance = patientComponent.debugElement.componentInstance;
    patientComponent.detectChanges();
    instance.currentPage = 2;
    instance.changePage(1);
    expect(instance.currentPage).toEqual(3);
    instance.changePage(-1);
    expect(instance.currentPage).toEqual(2);
  });

  it('should filter the values from the list based on search criteria', async(() => {
    let resultData = [{
      barcode: 'b66df241',
      activationTime: '2021-07-12 16:00:00',
      resultTime: '2021-07-12 16:00:00',
      name: 'Peter Chan',
      result: 'negative',
      resulType: 'rtpcr',
      patientId: '12345678901'
    },
    {
      barcode: 'b66df241',
      activationTime: '2021-07-12 16:00:00',
      resultTime: '2021-07-12 16:00:00',
      name: 'PeterX ChanX',
      result: 'negative',
      resulType: 'rtpcr',
      patientId: '12345678901'
    },
    {
      barcode: 'b66df241',
      activationTime: '2021-07-12 16:00:00',
      resultTime: '2021-07-12 16:00:00',
      name: 'Peter Chan',
      result: 'negative',
      resulType: 'rtpcr',
      patientId: '12345678901'
    }];
    let patientComponent = TestBed.createComponent(PatientMgmtPageComponent);
    let instance = patientComponent.debugElement.componentInstance;
    let dataService = patientComponent.debugElement.injector.get(DataService);
    let spy = spyOn(dataService, 'getData').and.returnValue(of(resultData));    
    patientComponent.detectChanges();
    const textElement = patientComponent.debugElement.nativeElement.querySelector('input');
    textElement.value = 'Peter';        
    textElement.dispatchEvent(new Event('keyup'));    
    patientComponent.detectChanges();
    patientComponent.whenStable().then(() => {      
      for (let i of instance.patientList) {
        expect(i.name).toBe('Peter Chan');
      }
    });
  }));

  it('should filter the values from the list based on multiple search criteria', async(()=>{
    let resultData = [{
      barcode: 'b66df241',
      activationTime: '2021-07-12 16:00:00',
      resultTime: '2021-07-12 16:00:00',
      name: 'Peter Chan',
      result: 'negative',
      resulType: 'rtpcr',
      patientId: '12345678901'
    },
    {
      barcode: 'b66df241',
      activationTime: '2021-07-12 16:00:00',
      resultTime: '2021-07-12 16:00:00',
      name: 'PeterX ChanX',
      result: 'negative',
      resulType: 'rtpcr',
      patientId: '12345678901'
    },
    {
      barcode: 'b66df241',
      activationTime: '2021-07-12 16:00:00',
      resultTime: '2021-07-12 16:00:00',
      name: 'Peter Chan',
      result: 'negative',
      resulType: 'rtpcr',
      patientId: '12345678901'
    }];
    let patientComponent = TestBed.createComponent(PatientMgmtPageComponent);
    let instance = patientComponent.debugElement.componentInstance;
    let dataService = patientComponent.debugElement.injector.get(DataService);
    let spy = spyOn(dataService, 'getData').and.returnValue(of(resultData));    
    patientComponent.detectChanges();
    const textElement = patientComponent.debugElement.nativeElement.querySelector('input');
    textElement.value = 'Peter:negative';        
    textElement.dispatchEvent(new Event('keyup'));    
    patientComponent.detectChanges();
    patientComponent.whenStable().then(() => {
      for (let i of instance.patientList) {
        expect(i.name).toBe('Peter Chan');
        expect(i.result).toBe('negative');
      }
    });
  }));
});
