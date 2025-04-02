import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ModalController } from '@ionic/angular';
import { PostModalComponent } from '../post-modal/post-modal.component';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.page.html',
  styleUrls: ['./posts.page.scss'],
  standalone:false
})
export class PostsPage implements OnInit {
  posts: any[] = [];
  isLoading = false;

  constructor(
    private apiService: ApiService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.isLoading = true;
    this.apiService.getPosts().subscribe({
      next: (response: any) => {
        this.posts = Array.isArray(response.data) ? response.data : [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading posts', error);
        this.isLoading = false;
      }
    });
  }

  async openPostModal() {
    const modal = await this.modalCtrl.create({
      component: PostModalComponent
    });
    
    modal.onDidDismiss().then((modalData) => {
      if (modalData.data) {
        this.createPost(modalData.data);
      }
    });
    
    await modal.present();
  }

  createPost(postData: any) {
    this.isLoading = true;
    
    if (postData.game_date) {
      postData.game_date = new Date(postData.game_date).toISOString();
    }
    
    this.apiService.createPost(postData).subscribe({
      next: (response) => {
        console.log('Post created successfully', response);
        this.loadPosts();
      },
      error: (error) => {
        console.error('Error creating post', error);
        this.isLoading = false;
      }
    });
  }
}