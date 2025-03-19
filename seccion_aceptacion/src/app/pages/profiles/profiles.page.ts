import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.page.html',
  styleUrls: ['./profiles.page.scss'],
  standalone: false,
})
export class ProfilesPage implements OnInit {

  profiles =[
    { id: 1, name: 'John Doe', age: 25, bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc. Nullam auctor, nunc nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc.' },
    { id: 2, name: 'Jane Doe', age: 22, bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc. Nullam auctor, nunc nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc.' },
  ];

  profile: any = null;

  constructor() { }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.profile = this.profiles.length ? this.profiles.shift() : null;
  }

  acceptProfile() {
    console.log('Perfil aceptado:', this.profile);
    this.loadProfile();
  }

  rejectProfile() {
    console.log('Perfil rechazado:', this.profile);
    this.loadProfile();
  }

}
