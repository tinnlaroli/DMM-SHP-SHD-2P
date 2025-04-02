import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const authenticated = await this.authService.isAuthenticated();
    if (authenticated) {
      return true; // Si está autenticado, permitir el acceso
    } else {
      this.router.navigate(['/login']); // Si no está autenticado, redirigir al login
      return false;
    }
  }
}
