import { Injectable } from '@angular/core';
import { utf8Encode } from '@angular/compiler/src/util';

@Injectable({
  providedIn: 'root'
})
export class ToolService {

  constructor() { }

  formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
  }

  getToken(deviceNumber, actionType, aliasName, location, deviceFrom, expiration, code){
    let result = '';

    switch(actionType) { 
        case '7': { 
            result = actionType + '|' + deviceNumber + '|' + code + '|' + expiration;
           break; 
        } 
        default: { 
            result = actionType + '|' + location + '|' + deviceNumber + '|' + aliasName;
           break; 
        } 
     }

    console.log(result);

    let valb64 = btoa(utf8Encode(result));
    result = this.toHex(valb64.toString());

    return result.toUpperCase();
  }

  toHex(str) {
    var result = '';

    for (var i=0; i<str.length; i++) {
      result += str.charCodeAt(i).toString(16);
    }

    return result;
  }

}
