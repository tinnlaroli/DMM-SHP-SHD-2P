import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';
  name: string = '';
  isRegistering: boolean = false; // Controla si estamos en la vista de registro o login

  constructor(
    private authService: AuthService,
    private router: Router,
    private storage: Storage,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  // Cambiar entre Login y Register
  toggleRegister() {
    this.isRegistering = !this.isRegistering;
  }

  // Método para manejar el login
  async login() {
    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
      spinner: 'crescent',
      duration: 5000,
    });

    await loading.present();

    const credentials = {
      email: this.email.trim(),
      password: this.password.trim(),
    };

    // Verificación básica de campos
    if (!credentials.email || !credentials.password) {
      await loading.dismiss();
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Todos los campos son requeridos',
        buttons: ['Entendido'],
      });
      await alert.present();
      return;
    }

    try {
      const response: any = await this.authService
        .login(credentials)
        .toPromise();
      if (response?.token) {
        await this.storage.set('token', response.token);
        await this.storage.set('user', response.user); // Guarda datos adicionales si existen
        this.router.navigate(['/posts'], { replaceUrl: true });
      } else {
        throw { status: 401, error: { message: 'Credenciales inválidas' } };
      }
    } catch (error: any) {
      console.error('Error en login:', error);

      let errorMessage = 'Error al iniciar sesión';
      if ((error as any).status === 400) {
        errorMessage = (error as any).error?.message || 'Datos inválidos';
      } else if (error.status === 401) {
        errorMessage = 'Usuario o contraseña incorrectos';
      } else if (error.status === 0) {
        errorMessage = 'No se pudo conectar al servidor';
      } else if (
        typeof error === 'object' &&
        error !== null &&
        'status' in error &&
        (error as any).status >= 500
      ) {
        errorMessage = 'Error en el servidor';
      }

      const alert = await this.alertController.create({
        header: 'Error',
        message: errorMessage,
        buttons: ['Entendido'],
        cssClass: 'custom-alert',
      });

      await alert.present();
    } finally {
      await loading.dismiss();
    }
  }

  // Método para manejar el registro
  async register() {
    const loading = await this.loadingController.create({
      message: 'Registrando usuario...',
      spinner: 'crescent',
      duration: 5000,
    });

    await loading.present();

    if (!this.name || !this.email || !this.password) {
      await loading.dismiss();
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Todos los campos son requeridos',
        buttons: ['Entendido'],
      });
      await alert.present();
      return;
    }

    try {
      const response = await this.authService
        .register(this.name, this.email, this.password)
        .toPromise();
      const token = response.token;
      await this.authService.storeToken(token); // Almacena el token

      // Redirige a la página principal después de hacer registro
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Registration failed', error);

      let errorMessage = 'Error al registrarse';
      if ((error as any).status === 400) {
        if (typeof error === 'object' && error !== null && 'error' in error) {
          errorMessage = (error as any).error?.message || 'Datos inválidos';
        } else {
          errorMessage = 'Datos inválidos';
        }
      } else if (
        typeof error === 'object' &&
        error !== null &&
        'status' in error &&
        (error as any).status >= 500
      ) {
        errorMessage = 'Error en el servidor';
      }

      const alert = await this.alertController.create({
        header: 'Error',
        message: errorMessage,
        buttons: ['Entendido'],
      });

      await alert.present();
    } finally {
      await loading.dismiss();
    }
  }
  async loginWithGithub() {
    try {
      await this.authService.loginWithGithub();
    } catch (error) {
      console.error('Error en GitHub Auth:', error);
    }
  }

  // Método para login con Google
  async googleSignIn() {
    try {
      const user = await this.authService.googleSignIn();
      console.log('Usuario de Google:', user);
    } catch (error) {
      console.error('Error en Google Auth:', error);
    }
  }
}
