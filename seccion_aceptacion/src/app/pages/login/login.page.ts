import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;  // Operador ! para inicialización diferida
  showPassword = false;
  isLoading = false;
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/profiles';
  }

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30)
      ]]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid || this.isLoading) return;

    this.isLoading = true;
    const loading = await this.presentLoading();

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          loading.dismiss();
        })
      )
      .subscribe({
        next: () => {
          this.router.navigateByUrl(this.returnUrl, { replaceUrl: true });
        },
        error: async (error) => {
          console.error('Login error:', error);
          await this.handleLoginError(error);
        }
      });
  }

  private async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Iniciando sesión...',
      spinner: 'crescent',
      translucent: true,
      backdropDismiss: false
    });
    await loading.present();
    return loading;
  }

  private async handleLoginError(error: any): Promise<void> {
    let errorMessage = 'Error al iniciar sesión';
    
    if (error?.error?.message) {
      errorMessage = error.error.message;
    } else if (error?.message) {
      errorMessage = error.message;
    }

    const alert = await this.alertCtrl.create({
      header: 'Error',
      message: errorMessage,
      buttons: ['OK'],
      cssClass: 'error-alert'
    });
    
    await alert.present();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Helpers para el template
  get emailControl() {
    return this.loginForm.get('email');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }

  getEmailErrorMessage(): string {
    if (this.emailControl?.hasError('required')) {
      return 'El correo es requerido';
    }
    if (this.emailControl?.hasError('pattern')) {
      return 'Formato de correo inválido';
    }
    return this.emailControl?.hasError('email') ? 'Correo no válido' : '';
  }

  getPasswordErrorMessage(): string {
    if (this.passwordControl?.hasError('required')) {
      return 'La contraseña es requerida';
    }
    if (this.passwordControl?.hasError('minlength')) {
      return `Mínimo ${this.passwordControl.errors?.['minlength'].requiredLength} caracteres`;
    }
    if (this.passwordControl?.hasError('maxlength')) {
      return `Máximo ${this.passwordControl.errors?.['maxlength'].requiredLength} caracteres`;
    }
    return '';
  }
}