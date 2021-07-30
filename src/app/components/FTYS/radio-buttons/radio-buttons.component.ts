import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { StorageWebService } from '../../../Services/Storage/StorageWeb.service';
import * as moment from 'moment-timezone'
@Component({
  selector: 'app-radio-buttons',
  templateUrl: './radio-buttons.component.html',
  styleUrls: ['./radio-buttons.component.scss'],
})
export class RadioButtonsComponent implements OnInit {
  @Input() lab;
  @Input() required;
  @Input() hel;
  @Input() readonly;
  @Input() opts;
  @Input() values;
  @Input() api;
  @Input() idActivity;

  @Output() cerrado = new EventEmitter();

  value = '';

  constructor(
    private storage: StorageWebService,
    private alert: AlertController
  ) { }

  ngOnInit() {
    console.log(this.opts, typeof this.opts);

    const value = this.values.filter((item) => {
      return item.apiId === this.api;
    })

    if (value.length > 0) {
      console.log(value[0].Value, 'juju')

      this.opts = this.opts.filter((item) => item.txt === value[0].Value)
      this.value = value[0].Value;
    }

    console.log(this.values, ' texto', this.api)
  }

  async change (event) {

    if (this.api === 'DEMORA') {

      if (event.detail.value === 'Otro') {

        const myalert = await this.alert.create({
          header: 'Mensaje',
          message: 'Específique el motivo demora de la solicitud',
          inputs: [
            {
              type: 'text',
              placeholder: 'Escriba Motivo',
              name: 'motivo'
            }
          ],
          buttons: [
            {
              text: 'Cancelar',
              role:'cancel'
            },
            {
              text: 'Aceptar',
              cssClass: 'ok',
              handler: async (data) => {
  
                const myChange = await this.storage.updateActiveForm({
                  value: 'Otro|' + data.motivo,
                  api: 'DEMORA',
                  id: this.idActivity
                });
            
                if (myChange) {
            
                  console.log('CAMBIADO');
  
                 this.myAlert('Otro|' + data.motivo)
                }
  
              }
            }
          ]
        })
  
        await myalert.present()
          

      } else {
        this.myAlert(event.detail.value);
      }
    
    } else {
      const myChange = await this.storage.updateActiveForm({
        value: event.detail.value,
        api: this.api,
        id: this.idActivity
      });
  
      if (myChange) {
  
        console.log('CAMBIADO');
  
      }
    }

  

  }


  async myAlert(data) {
    const myalert = await this.alert.create({
      header: 'Atención',
      message: 'Usted ha seleccionado un motivo demora ¿Desea esperar?',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Si acepto',
          cssClass: 'ok',
          handler: async () => {

            const myChange = await this.storage.updateActiveForm({
              value: moment().format('YYYY-MM-DD HH:mm:ss'),
              api: 'Espera',
              id: this.idActivity
            });
        
            if (myChange) {
        
              
              const myChange = await this.storage.updateActiveForm({
                value: data,
                api: 'DEMORA',
                id: this.idActivity
              });
          
              if (myChange) {
          
  
                this.cerrado.emit({
                  status: false
                })
          
          
              }
        
        
            }

          }
        },
        {
          text: 'No',
          cssClass: 'not',
          handler: async () => {
            const myChange = await this.storage.updateActiveForm({
              value: moment().format('YYYY-MM-DD HH:mm:ss'),
              api: 'FechaLlegadaDestino',
              id: this.idActivity
            });

            if (myChange) {

               
              const myChange = await this.storage.updateActiveForm({
                value: data,
                api: 'DEMORA',
                id: this.idActivity
              });
          
              if (myChange) {
          
        
              console.log('CAMBIADO');

              this.cerrado.emit({
                status: true
              })

            }
        
            }
          }
        }
      ]
    })

    await myalert.present()
      
  }

}
