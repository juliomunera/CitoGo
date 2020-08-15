import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigApp } from '../helper/config';

@Injectable({
  providedIn: 'root'
})
export class RestapiService {

  public config : ConfigApp = new ConfigApp();

  constructor(private http: HttpClient) { }

  generateCodeSms(obj : any) {

    return new Promise((resolve, reject) => {

      this.http.post(this.config.SMS_URL, obj)
        .subscribe(res => { 
          console.log(res);
            resolve(res);
        }, (err) => {
          console.log(err);
            reject(err);
        });
    });
  }

}
