import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.page.html',
  styleUrls: ['./profiles.page.scss'],
  standalone: false,
})
export class ProfilesPage implements OnInit {

  profiles = [
    { id: 1, name: 'John Doe', age: 25, bio: 'Amante de la naturaleza.', image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Jane Doe', age: 22, bio: 'Apasionada por la música.', image: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Alice Smith', age: 30, bio: 'Fan de la tecnología.', image: 'https://via.placeholder.com/150' }
  ];

  constructor() { }

  ngOnInit() {}

  // Aceptar perfil
  acceptProfile(profile: any) {
    console.log('Perfil aceptado:', profile);
    this.removeProfile(profile.id);
  }

  // Rechazar perfil
  rejectProfile(profile: any) {
    console.log('Perfil rechazado:', profile);
    this.removeProfile(profile.id);
  }

  // Elimina el perfil de la lista
  removeProfile(id: number) {
    this.profiles = this.profiles.filter(p => p.id !== id);
  }
}
