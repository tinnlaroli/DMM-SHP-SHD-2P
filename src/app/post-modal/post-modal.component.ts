import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-modal',
  templateUrl: './post-modal.component.html',
  styleUrls: ['./post-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule] // Added CommonModule
})
export class PostModalComponent {
  content: string = '';
  postType: string = 'game_invitation';
  gameTitle: string = '';
  gamePlatform: string = 'PlayStation';
  gameDate: string = new Date().toISOString();
  maxParticipants: number = 4;

  platforms = [
    'PlayStation',
    'Xbox',
    'PC',
    'Nintendo Switch',
    'Mobile',
    'Other'
  ];

  constructor(private modalCtrl: ModalController) {}

  dismissModal() {
    this.modalCtrl.dismiss();
  }

  publish() {
    if (this.validateForm()) {
      this.modalCtrl.dismiss({
        content: this.content.trim(),
        post_type: this.postType,
        game_title: this.gameTitle,
        game_platform: this.gamePlatform,
        game_date: new Date(this.gameDate).toISOString(),
        max_participants: this.maxParticipants
      });
    }
  }

  private validateForm(): boolean {
    return this.content.trim() !== '' && 
           this.gameTitle.trim() !== '' &&
           this.gamePlatform.trim() !== '' &&
           this.gameDate !== '';
  }
}