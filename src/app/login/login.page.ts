
import { PlatformsService } from '../Services/PLatforms/Platform.service';
import { StorageWebService } from '../Services/Storage/StorageWeb.service';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../Services/Api/Api.service';
import { ToastService } from '../Services/Utilities/Toast.service';
import { NavController, MenuController, ToastController } from '@ionic/angular';
import { DataComparnyService } from 'src/app/Services/dataCompany.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { NotificationsService } from '../Services/Utilities/push.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  
  login = {
    user: '',
    password: '',
    device: ''
  };

  loginEntrena = {
    login: '',
    password: ''
  };


  statusResponse = false;
  plt = '';

  ext = false;

  IPAddres = '';

  id = 'id'

  constructor(
    private apiService: ApiService,
    private toastService: ToastService,
    private navCtrl: NavController,
    private dataCompanyService: DataComparnyService,
    private storageService: StorageWebService,
    private myPlatform: PlatformsService,
    private menuCtrl: MenuController,
    private router: Router,
    private storage: Storage,
    private toas: ToastController,
    private push: NotificationsService
    ) {

      this.push.$usuarioID.subscribe(async (id) => {
        this.id = id;
        this.login.device =  id;

        await this.storageService.insertID(id);
      })

      this.myPlatform.$myplatform.subscribe((plt: any) => {
        this.plt = plt;
      });


    }

  ngOnInit() {
  }

  ionViewWillEnter() {
    // this.menuCtrl.enable(false, 'menu');
    this.createdCollections();
    
  }

  async createdCollections() {
    
   
        console.log('Holaaa')
    const login = await this.storage.get('login');
    const forms = await this.storage.get('forms');
    const formsActive = await this.storage.get('formActive');
    const chats = await this.storage.get('chats');

    if (!login) {
      await this.storage.set('login', []);
    } 

    if (!forms) {
      await this.storage.set('forms', []);
    }

    if (!formsActive) {
      await this.storage.set('formActive', []);
    }

    if (!chats) {
      await this.storage.set('chats', []);
    }
      
    

  }


  changeLogin( event ) {
    this.ext = event.detail.checked;
    console.log(event)
  }

  entry() {
    this.apiService.postLogin(this.login).subscribe(async (data: any) => {
  
      console.log(data);

      if (data.status === 'Error') {
        this.toastService.newCreatedToast(data.message, false);
      } else {
        data.password = this.login.password;
        data.device = this.login.device;
        await this.storageService.insertUser(data);
        await this.toastService.newCreatedToast('Iniciando', true)
      
     await this.navCtrl.navigateRoot(['/tabs/tab1']);
      }
      // data.login = this.login.user;
      // data.name = data.FirstName + ' ' + data.LastName;

      

      // console.log(data, 'datica');

   
  }, (err) => {
      this.toastService.newCreatedToast(err, true);
  });
  }

  async scannerQR(event) {

    
    if(event.next) {

      const msgg = await this.toas.create({
        message: event.msg,
        duration: 2000
      })


      await msgg.present();

     // const update = await this.storage.updateForm();
    
     await this.navCtrl.navigateRoot(['/tabs/tab1']);
   

    } else {

      const deleteLogin = await this.storageService.deleteLogin();

      if (deleteLogin) {
        const msgg = await this.toas.create({
          message: event.msg,
          cssClass: 'error',
          duration: 5000
        })
  
  
        await msgg.present();
      }
     
    }

  }

 
   


    
  

}
