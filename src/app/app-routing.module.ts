import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NewsfeedComponent } from "./dashboard/newsfeed/newsfeed.component";
import { ProfileComponent } from "./dashboard/profile/profile.component";
import { LikesComponent } from "./dashboard/likes/likes.component";
import { 
  AuthGuardService as AuthGuard 
} from './services/auth-guard.service';

const routes: Routes = [
  // Auth
  { path: 'authentication', component: AuthComponent },
  // Dashboard
  {
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'newsfeed',
        component: NewsfeedComponent
      },
      {
        path: 'likes',
        component: LikesComponent
      },
      {
        path: 'profile/:id',
        component: ProfileComponent
      },
    ]
  },
  // Default
  { path: '**', redirectTo: 'authentication' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
