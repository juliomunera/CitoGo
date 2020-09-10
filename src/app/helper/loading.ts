import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  loader:HTMLIonLoadingElement;

  constructor(public loadingController: LoadingController) {
  }

  async present(options: object) {

    this.loader =  await this.loadingController.create(options);
    await this.loader.present();
  }

  async dismiss() {
    await this.loader.dismiss()
    .then(()=>{
      this.loader = null;
    })
    .catch(e => console.log(e));
  }

  async showLoading(loadingId: string, loadingMessage: string = 'Cargando...') {
    const loading = await this.loadingController.create({
      id: loadingId,
      message: loadingMessage,
      spinner: 'circles'
    });
    return await loading.present();
}

  async dismissLoader(loadingId: string) {
      return await this.loadingController.dismiss(null, null, loadingId).then(() => console.log('loading dismissed'));
  }


}