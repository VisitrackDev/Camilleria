import { Component, Input, OnInit } from '@angular/core';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ActionSheetController, ToastController } from '@ionic/angular';
import { Base64 } from '@ionic-native/base64/ngx';
import { StorageWebService } from '../../../Services/Storage/StorageWeb.service';
import { ApiService } from '../../../Services/Api/Api.service';


declare var window;
@Component({
  selector: 'app-picture',
  templateUrl: './picture.component.html',
  styleUrls: ['./picture.component.scss'],
})
export class PictureComponent implements OnInit {

  @Input() lab;
  @Input() readonly;
  @Input() hel;
  @Input() required;
  @Input() values;
  @Input() idActivity;
  list = [];
  listRoot = [];

  base1 = '';
  base2 = '';

  capture = false;

  constructor(
    private actionCtrl: ActionSheetController,
    private camera: Camera,
    private toast: ToastController,
    private base64: Base64,
    private storage: StorageWebService,
    private api: ApiService
  ) { }

  async ngOnInit() {


    const active = await this.storage.getActive(this.idActivity);

    if (active) {
      if (active.length > 0) {
        const url = active[0].extras.Values.filter((it) => {
          return it.apiId === 'URL'
        })

        if (url.length > 0) {
          this.listRoot = [{path: url[0].Value}]
        }
      }
    }

  }


  


  async opts() {
    const action = await this.actionCtrl.create({
      header: 'Escoge una opción',
      buttons: [
        {
          icon: 'camera-outline',
          text: 'Tomar foto de la cámara',
          handler: async () => {
              if (this.list.length === 0) {
                this.takePicture(this.camera.PictureSourceType.CAMERA);
              } else {
                const toast = await this.toast.create({
                  message: 'Solo puede añadir una foto',
                  duration: 3000
                })

                await toast.present();
              }
         
          }
        },
        {
          icon: 'image-outline',
          text: 'Subir foto de galería',
          handler: async () => {

              if (this.list.length === 0) {
                this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY, 'image');
              } else {
                const toast = await this.toast.create({
                  message: 'Solo puede añadir una foto',
                  duration: 3000
                })

                await toast.present();
              }
           
          }
        },
        
      ]
    })

    await action.present();
}



  public takePicture(sourceType, mode?) {
    
    const options: CameraOptions = {


      quality: 100,
      targetWidth: 900,
      targetHeight: 600,
    correctOrientation: true,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.PNG,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType: sourceType
    };

    this.camera.getPicture(options).then( async (imageData) => {
     
       // // // console.log('Mi archivo', name, mim)
       this.list.push({path: imageData});
       const url = window.Ionic.WebView.convertFileSrc( imageData );
       this.listRoot = [{path: url}];

       let filePath: string = imageData;
      this.base64.encodeFile(filePath).then((base64File: string) => {
      
        const temp = base64File.split(',');
        if (temp.length > 0) {
          this.base1 = temp[1];
        }
      }, (err) => {
        console.log(err);
      });

   
       // // // console.log(this.carrete);
       this.camera.cleanup().then(() =>  {});
    });
  
  }

  async upload() {
      const login = await this.storage.getLogin();

      if (login) {
          this.api.upload(login[0].AccessToken, {bucket: 'bineast.visitrack.com', base: this.base1, ext: 'png'}).subscribe(async(rs: any) => {
            
            if (rs.GUID) {

              const upload = await this.storage.updateActiveForm({
                api: 'FOTO',
                value: rs.GUID,
                id: this.idActivity
              })

          

              if (upload) {
              

                const upload2 = await this.storage.updateActiveForm({
                  api: 'URL',
                  value: this.listRoot[0].path,
                  id: this.idActivity
                })

                if (upload2) {
                  this.capture = true;
                  const toast = await this.toast.create({
                    message: 'Foto guardada',
                    duration: 3000
                  })
    
                  await toast.present()
                }

              }
            } else {
              const toast = await this.toast.create({
                message: 'No se pudo subir la foto',
                duration: 3000
              })

              await toast.present()
            }
          }, async (err) => {
            const toast = await this.toast.create({
              message: 'No se pudo subir la foto',
              duration: 3000
            })

            await toast.present()
          })
      }
  }

  clear() {
    this.list = [];
    this.listRoot = [];
  }
}
