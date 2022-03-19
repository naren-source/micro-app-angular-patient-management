import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, map, of, take} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DataService {

    public orgName = new BehaviorSubject<string>('Prenetics');
    orgList: any[]= [];
    currentOrgId: number | undefined;
    constructor(private http: HttpClient){}

    setOrgName(name: string){
        this.orgName.next(name);        
        let currentOrgName;
        for(let i of this.orgList){
            this.orgName.pipe(take(1)).subscribe(data=>{
                currentOrgName = data;
            });
            if(i.attributes.name === currentOrgName){
                this.currentOrgId = i.id;
            }
        }
        this.getData();
    }

    getOrgs(){        
        this.http.get('http://localhost:9080/test/v1.0/org')
        .subscribe((response:any)=>{
            this.orgList = response.data;
        });
    }

    getData(){                
        return this.http.get(`http://localhost:9080/test/v1.0/org/${this.currentOrgId}/sample`)
        .pipe(
            map(
                (sr:any)=>{
                    let patientList:any = [];
                    let entries = sr.meta.total;
                    for(let i=0;i<entries;i++){
                        let barcode = sr.data[i].id.split('-')[0];
                        let activationTime = sr.data[i].attributes.activateTime;
                        let resultTime = sr.data[i].attributes.resultTime;
                        let relId = sr.data[i].relationships.profile.data.id;
                        let name ='';
                        for(let j=0;j<entries;j++){
                          if(sr.included[j].id == relId){
                            name = sr.included[j].attributes.name;
                          }
                        }
                        let result = sr.data[i].attributes.result;
                        let resultType = sr.data[i].attributes.resultType;
                        let patientId = sr.data[i].attributes.sampleId;
                        let patient = {
                          barcode,
                          activationTime,
                          resultTime,
                          name,
                          result,
                          resultType,
                          patientId
                        }
                        patientList.push(patient); 
                    }
                    return patientList;
                }
            ),
            catchError((error)=>{
                console.log(error);
                throw new Error();                
            })
        );
    }
}