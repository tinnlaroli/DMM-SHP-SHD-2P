import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  standalone: false,
  selector: 'app-accept-reject',
  templateUrl: './accept-reject.page.html',
  styleUrls: ['./accept-reject.page.scss'],
})
export class AcceptRejectPage implements OnInit {
  profiles: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadProfiles();
  }

  loadProfiles() {
    this.apiService.getProfiles().subscribe(
      (data) => {
        this.profiles = data;
      },
      (error) => {
        console.error('Error al cargar perfiles', error);
      }
    );
  }

  acceptProfile(profileId: string) {
    this.apiService.acceptProfile(profileId).subscribe(
      (response) => {
        this.loadProfiles(); // Recargar perfiles después de aceptar uno
      },
      (error) => {
        console.error('Error al aceptar perfil', error);
      }
    );
  }

  rejectProfile(profileId: string) {
    this.apiService.rejectProfile(profileId).subscribe(
      (response) => {
        this.loadProfiles(); // Recargar perfiles después de rechazar uno
      },
      (error) => {
        console.error('Error al rechazar perfil', error);
      }
    );
  }
}
