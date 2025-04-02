import { Component, OnInit } from '@angular/core';
import { Swiper } from 'swiper';
import { ApiService } from '../../services/api.service';
import { catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.page.html',
  styleUrls: ['./profiles.page.scss'],
  standalone: false,
})
export class ProfilesPage implements OnInit {
  profiles: any[] = [];
  isLoading: boolean = true;
  error: string | null = null;
  
  // Datos de ejemplo (puedes eliminarlos una vez que la API funcione)
  demoProfiles = [
    { id: 1, name: 'PixelRanger', age: 20, bio: 'Amo los juegos de 8 bits.', image: '../../assets/icon/PixelRanger.png', score: 85 },
    { id: 2, name: 'NeoNinja', age: 25, bio: 'Domino el joystick desde los 90s.', image: '../../assets/icon/NeoNinja.png', score: 78 },
    { id: 3, name: 'CyberQueen', age: 22, bio: 'Retro gamer y streamer.', image: '../../assets/icon/CyberQueen.png', score: 91 },
    { id: 4, name: 'GlitchHunter', age: 28, bio: 'Cazador de bugs y glitches.', image: '../../assets/icon/GlitchHunter.png', score: 88 },
  ];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadProfiles();
  }

  loadProfiles() {
    this.isLoading = true;
    this.error = null;
    
    this.apiService.get('profiles') // Ajusta el endpoint según tu API
      .pipe(
        catchError(error => {
          this.error = 'Error al cargar perfiles. Mostrando datos de ejemplo.';
          console.error('Error:', error);
          // Si falla, usa datos de demostración
          this.profiles = [...this.demoProfiles];
          return throwError(error);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          // Ajusta según la estructura de respuesta de tu API
          this.profiles = response.data || response;
          console.log('Perfiles cargados:', this.profiles);
          
          // Si no hay perfiles, usa los de demostración
          if (this.profiles.length === 0) {
            this.profiles = [...this.demoProfiles];
          }
        }
      });
  }

  onSwiper(swiper: Swiper) {
    console.log('Swiper instance:', swiper);
  }

  onSlideChange(swiper: any) {
    console.log('Slide cambiado, índice actual:', swiper.activeIndex);
  }

  acceptProfile(profile: any) {
    console.log('✅ Perfil aceptado:', profile);
    
    // Aquí podrías llamar a tu API para registrar la aceptación
    this.apiService.post('matches/accept', { profileId: profile.id })
      .subscribe({
        next: (response) => {
          console.log('Aceptación registrada:', response);
          this.removeProfile(profile);
        },
        error: (error) => {
          console.error('Error al aceptar perfil:', error);
          // Si falla la API, igual quita el perfil de la vista
          this.removeProfile(profile);
        }
      });
  }

  rejectProfile(profile: any) {
    console.log('❌ Perfil rechazado:', profile);
    
    // Aquí podrías llamar a tu API para registrar el rechazo
    this.apiService.post('matches/reject', { profileId: profile.id })
      .subscribe({
        next: (response) => {
          console.log('Rechazo registrado:', response);
          this.removeProfile(profile);
        },
        error: (error) => {
          console.error('Error al rechazar perfil:', error);
          // Si falla la API, igual quita el perfil de la vista
          this.removeProfile(profile);
        }
      });
  }

  removeProfile(profile: any) {
    this.profiles = this.profiles.filter(p => p.id !== profile.id);
    
    // Si se quedó sin perfiles, recarga
    if (this.profiles.length === 0) {
      this.loadProfiles();
    }
  }
}