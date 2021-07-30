import { Component, OnInit, Input } from '@angular/core';
import { StorageWebService } from '../../../Services/Storage/StorageWeb.service';
import { ApiService } from '../../../Services/Api/Api.service';
import { ToastController } from '@ionic/angular';
import { LoadingService } from '../../../Services/Utilities/Loading.service';

@Component({
  selector: 'app-numeric-value',
  templateUrl: './numeric-value.component.html',
  styleUrls: ['./numeric-value.component.scss'],
})
export class NumericValueComponent implements OnInit {

  @Input() lab;
  @Input() required;
  @Input() hel;
  @Input() pho;
  @Input() readonly;
  @Input() values;
  @Input() api;
  @Input() id;
  @Input() idActivity;
  value = '';
  marker = false;

  loadNumeric = false;
  constructor(
    private storage: StorageWebService,
    private apiService: ApiService,
    private toas: ToastController,
    private loading: LoadingService
  ) { }

  ngOnInit() {
    if (this.pho === '') {
      this.pho = 'Digitar valor';
    }

    const value = this.values.filter((item) => {
      return item.apiId === this.api;
    })

    if (value.length > 0) {
      this.value =  value[0].Value
    }
  }


  async change (event) {

    console.log(this.api)

    if (event.detail.value <= 2 && event.detail.value != '') {

      if (this.marker) {
        const msgg = await this.toas.create({
          message: 'Ya especificó camilleros adicionales, no puede cambiar su cantidad',
          cssClass: 'error',
          duration: 4000
        })
  
  
        await msgg.present();
      } else {
        const myChange = await this.storage.updateActiveForm({
          value: event.detail.value,
          api: this.api,
          id: this.idActivity
        });
    
        if (myChange) {
    
          const login = await this.storage.getLogin();
  
          if (login) {
      
            const active = await this.storage.getActive(this.idActivity);
      
            if (active) {
      
              this.loadNumeric =true;
      
              let activity = active[0];
      
              this.apiService.aceptActivity({
                AccessToken: login[0].AccessToken,
                FormGUID: activity.extras.FormGUID,
                LocationGUID: activity.extras.LocationGUID,
                AssetGUID: activity.extras.AssetGUID,
                UserGUID: login[0].GUID,
                Duration: "60",
                Values: JSON.stringify(activity.extras.Values),
                ActivityGUID: activity.extras.GUID,
                CompanyStatusGUID: '789AD011-C4B1-4A2F-A748-74B9B8904E7C'
              }).subscribe(async (dat: any) => {
               //  // console.log(dat, activity)
      
             
                 
                if (dat.Status === 'OK') {
                  this.marker = true;
               //   await loading.dismiss();
             
               this.loadNumeric =false;
               const msgg = await this.toas.create({
                message: 'Información enviada ',
                duration: 5000
              })

              await msgg.present();

              var torre = activity.extras.Values.filter((it) => {
                return it.apiId.includes('TORREPISO_ORG')
              })
              var prioridad = activity.extras.Values.filter((it) => {
                return it.apiId.includes('PRIORIDAD')
              })

              console.log(torre)

              this.apiService.userAditional(login[0].AccessToken, {ID: activity.extras.ID, value: event.detail.value + '|' + torre[0].Value, priority: parseFloat(prioridad[0].Value)}).subscribe(async (r: any) => {
                console.log(r, 'ADICIONAL');

                if (r[0].Status === 'Error') {
                  const msgg = await this.toas.create({
                    message: 'No se pudo crear la solicitud adicional ' + r[0].Description,
                    duration: 5000
                  })
    
                  await msgg.present();
                } else {

                  const msgg = await this.toas.create({
                    message: 'Solicitud adicional creada',
                    duration: 5000
                  })
    
                  await msgg.present();

                }

              }, async (err) => {
                this.marker = false;
                const msgg = await this.toas.create({
                  message: 'No se creó la solicitud adicional',
                  duration: 5000
                })
  
                await msgg.present();
              })
           
                } else {
      
                  this.loadNumeric =false;
        
                  const msgg = await this.toas.create({
                    message: 'Error ' + dat.Message,
                    duration: 5000
                  })
        
                  await msgg.present();
        
                }
        
             })
              
            }
      
           
      
          }
    
          console.log('CAMBIADO');
    
        }
      }
 
      
    } else {
      const msgg = await this.toas.create({
        message: 'Solo se permite hasta 2 camilleros',
        cssClass: 'error',
        duration: 3000
      })


      await msgg.present();
    }

   

  }

}
