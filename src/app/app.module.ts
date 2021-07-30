import { ComponentsModule } from './components/components.module';
import { Network } from '@ionic-native/network/ngx';
import { LoginGuard } from './guards/login.guard';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IonicStorageModule } from '@ionic/storage-angular';


import { Drivers } from '@ionic/storage';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { pageGuard } from './guards/page.guard';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    ComponentsModule,
    IonicStorageModule.forRoot({
    name: 'diamante',
    driverOrder: [Drivers.IndexedDB, Drivers.SecureStorage, Drivers.LocalStorage]
  }),
  HttpClientModule,],
  providers: [
    LoginGuard,
    pageGuard,
    BarcodeScanner,
    LocationAccuracy,
    Geolocation,
    AndroidPermissions,
    Camera,
    StatusBar,
    Base64,
    OneSignal,
    Vibration,
    Network,
     { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
