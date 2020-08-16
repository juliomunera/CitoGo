import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ToolService } from '../helper/tools';

import { HttpClient } from '@angular/common/http';
import { RestapiService } from '../helper/restapi';
import { LoadingService } from '../helper/loading';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public deviceNumber : string = '';
  public actionType : string = '';
  public aliasName : string = '';
  public deviceFrom : string = '';
  public expiration : string = '3600';
  public token : string = '';
  public location : string = '';
  private _token : string = '';

  public disabled_location : boolean = false;
  public disabled_aliasName : boolean = false;
  public disabled_deviceFrom : boolean = false;

  private toolService : ToolService;

  constructor(
    private alertController: AlertController, 
    private http: HttpClient, 
    private loadingService: LoadingService,
    private rest: RestapiService
    ) {
      
     }

  ngOnInit() {
  }

  async continue(){
    if(this.actionType===''){
      this.presentAlert('Debe seleccionar un tipo de acción');
      return;
    }

    if(this.deviceNumber===''){
      this.presentAlert('Debe ingresar el número del residente');
      return;
    }

    if(!parseInt(this.deviceNumber)){
      this.presentAlert('El número del residente debe ser numérico');
      return;
    }

    if (this.actionType !== '7') {
      if(this.location==='' && !this.disabled_location){
        this.presentAlert('Debe ingresar la ubicación del residente');
        return;
      }

      if(this.aliasName==='' && !this.disabled_aliasName){
        this.presentAlert('Debe ingresar el alias del residente');
        return;
      }
      
    }

    if(this.deviceFrom===''){
      this.presentAlert('Debe ingresar el número del emisor autorizado');
      return;
    }

    if(!parseInt(this.deviceFrom) && !this.disabled_deviceFrom){
      this.presentAlert('El número del emisor debe ser numérico');
      return;
    }

    if(this.expiration===''){
      this.presentAlert('Debe ingresar la caducidad del token (en segundos)');
      return;
    }

    if(!parseInt(this.expiration)){
      this.presentAlert('El valor de la caducidad del token debe ser numérico');
      return;
    }

    if(parseInt(this.expiration) < 3600){
      this.presentAlert('El valor de la caducidad del token debe mayor a 3600 segundos');
      return;
    }

    this.toolService = new ToolService();
    let code = this.toolService.random();

    this._token = this.toolService.getToken(
                      this.deviceNumber, this.actionType, this.aliasName, this.location, 
                      this.deviceFrom, this.expiration, code);
    
    this.sendCode(code);
  }

  clearTokenField()
  {
    this.token = '';
  }

  changeAction(){
    this.clearTokenField();
    this.enabledOption(this.actionType);
  }

  async sendCode(code){

    this.loadingService.present({
      message: 'Conectando al servidor...',
      duration: 1000
    });

    let obj = {
      numeroPortero : this.deviceFrom,
      numeroOrigen : this.deviceNumber,
      hash : this._token,
      accion : this.actionType,
      codigo : code
    };

    console.log(obj);
    
    this.rest.generateCodeSms(obj).then(response => {
      this.loadingService.dismiss();
      this.token = this._token;

      console.log(this.token);
    })
    .catch(error=>{

      this.loadingService.dismiss();
      this.presentAlert('Error al generar el código SMS.')
      return;
    });

    this.loadingService.dismiss();
  }

  async presentAlert(description: any) {
    const alert = await this.alertController.create({
      header: 'Información',
      message: description,
      buttons: ['Aceptar' ]
    });

    await alert.present();
  }

  enabledOption(action){
    console.log('Action: ');
    console.log(action);

    switch (action) {
      case '7':
        this.disabled_deviceFrom = false;
        this.disabled_aliasName = true;
        this.disabled_location = true;

        this.aliasName = '';
        this.location = '';
        break;

      case '6':

        this.disabled_deviceFrom = true;
        this.disabled_aliasName = true;
        this.disabled_location = true;

        this.aliasName = '';
        this.location = '';
        this.deviceFrom = '';
        break;        
    
      default:
        this.disabled_deviceFrom = false;
        this.disabled_aliasName = false;
        this.disabled_location = false;

        break;
    }
  }

  clear(){
    this.deviceNumber = '';
    this.actionType = '';
    this.aliasName = '';
    this.deviceFrom = '';
    this.expiration = '3600';
    this.token = '';
    this.location = '';
    this._token = '';

    this.disabled_location = false;
    this.disabled_aliasName = false;
    this.disabled_deviceFrom = false;
  }


}
