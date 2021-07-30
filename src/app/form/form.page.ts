import { ApiService } from 'src/app/Services/Api/Api.service';
import { StorageWebService } from './../Services/Storage/StorageWeb.service';
import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../Services/Utilities/Loading.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../Services/Utilities/Toast.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
})
export class FormPage implements OnInit {

  
  load = false;
  img = '';
  response;
  active;


  zone = '';
  loader;

  stop = false;
  

 id;
  constructor(
    private storage: StorageWebService,
    private api: ApiService,
    private  loading: LoadingService,
    private router: Router,
    private toas: ToastService,
    private loadin: LoadingController,
    private activeRoute: ActivatedRoute
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.id = this.activeRoute.snapshot.paramMap.get('id');
    this.Info(); 
  }

  close() {
    this.load = false;
  }

  async Info() {



    const login = await this.storage.getLogin();

    if (login) {
      this.img = login[0].logo;

      const active = await this.storage.getActive(this.activeRoute.snapshot.paramMap.get('id'));

      if (active) {
        if (active.length > 0) {
          this.loader = await this.loadin.create({
            message: 'Descangando formulario...',
            mode: 'ios',
            duration: 10000
          })
      
          await this.loader.present();

          this.zone = active[0].extras.zone;
          this.active = active[0];
          const form = await this.storage.getForm();


          if (form) {

            if (form.length > 0) {

              this.loader.dismiss();
              console.log('Entrando a consultar existente')

              this.response = form[0]
                  this.load = true;
             
            

            } else {

              console.log('Entrando a consultar no existe')

              this.api.getForms(login[0].AccessToken, '18142').subscribe(async (res: any) => {
                console.log(res, 'data')

                this.loader.dismiss();
                this.response = res[0];
         
                this.storage.insertForm(res[0]).then(() => {
                  this.load = true;
                })
      
               
              
              }, async (err) => {
                this.loader.dismiss();
                this.toas.newCreatedToast('No se pudo descargar el formulario, inténtelo nuevamente', false);
                this.router.navigate(['/tabs/tab2', this.activeRoute.snapshot.paramMap.get('id')]);
              }, async () => {
                this.loader.dismiss();
              })

            }
          
            
       
          }

       
        } else {
         //  this.router.navigate(['/tabs/tab1'])
          this.loader.dismiss();
        }
      }

    }

  }




}
