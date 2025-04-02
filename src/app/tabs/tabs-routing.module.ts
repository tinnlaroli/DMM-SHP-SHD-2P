import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs/accept-reject',
    pathMatch: 'full',
  },
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'accept-reject',
        loadChildren: () =>
          import('../accept-reject/accept-reject.module').then(
            (m) => m.AcceptRejectPageModule
          ),
      },
      {
        path: 'posts',
        loadChildren: () =>
          import('../posts/posts.module').then((m) => m.PostsPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
