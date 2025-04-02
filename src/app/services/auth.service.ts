import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { Observable } from 'rxjs';
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Browser } from '@capacitor/browser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private clientId = 'Ov23li2B4QDyn3VTvPTS';
  private redirectUri = 'io.ionic.starter://login-github';
  user: any;

  private apiUrl = 'https://dmm-shp-shd-2p-production.up.railway.app/api/auth'; // URL de la API
  private token: string | null = null;

  constructor(private http: HttpClient, private storage: Storage, private alertController: AlertController, private router: Router, private route: ActivatedRoute) {
    // Inicializar Ionic Storage
    this.storage.create(); // Se debe inicializar el Storage
  }

  // Método para iniciar sesión
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  register(name: string, email: string, password: string): Observable<any> {
    const userData = { name, email, password };  // Enviar los datos de usuario al backend
    return this.http.post(`${this.apiUrl}/register`, userData);
  }
  
  // Guardar el token en el almacenamiento local
  async storeToken(token: string) {
    this.token = token;
    await this.storage.set('auth_token', token); // Almacenar el token
  }

  // Recuperar el token del almacenamiento local
  async getToken(): Promise<string | null> {
    if (!this.token) {
      this.token = await this.storage.get('auth_token'); // Obtener el token almacenado
    }
    return this.token;
  }

  // Verificar si el usuario está autenticado
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return token !== null; // Si el token existe, el usuario está autenticado
  }

  // Método para hacer logout
  async logout() {
    this.token = null;
    await this.storage.remove('auth_token'); // Eliminar el token del almacenamiento
  }

  async loginWithGithub(){
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&scope=user`;
    const response = await Browser.open({ url: githubAuthUrl});
    if(response != null || response != undefined){
      this.checkAuthCallback();
    }
  }

  async checkAuthCallback() {
    this.route.queryParams.subscribe(async params => {
      if (params['code']) {
        console.log('Código recibido:', params['code']);
  
        // Mostrar alerta de éxito con Ionic
        const alert = await this.alertController.create({
          header: 'Inicio de sesión',
          message: `✅ Código recibido: ${params['code']}`,
          buttons: ['OK']
        });
        await alert.present();
  
        // Redirigir a la página de login
        this.router.navigate(['/login-github']);
      } else {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'No se recibió el código de autenticación.',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }


  async googleSignIn() {
    let googleUser = await GoogleAuth.signIn();
    const credential = firebase.auth.GoogleAuthProvider.credential(googleUser.authentication.idToken);
    return firebase.auth().signInWithCredential(credential);
  }
}
