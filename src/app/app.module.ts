import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthService } from "./services/auth.service";
import { JwtModule } from '@auth0/angular-jwt';
import { NavigationComponent } from './dashboard/navigation/navigation.component';
import { NewsfeedComponent } from './dashboard/newsfeed/newsfeed.component';
import { LoadingComponent } from './dashboard/loading/loading.component';
import { MatDialogModule } from "@angular/material/dialog";
import { CreatePostComponent } from './dashboard/modals/create-post/create-post.component';
import { PostService } from './services/post.service';
import { PostComponent } from './dashboard/posts/post/post.component';
import { EditPostComponent } from './dashboard/modals/edit-post/edit-post.component';
import { ProfileComponent } from './dashboard/profile/profile.component';
import { EditProfileComponent } from './dashboard/modals/edit-profile/edit-profile.component';
import { UserService } from './services/user.service';
import { PreviewUserComponent } from './dashboard/modals/preview-user/preview-user.component';
import { ViewPostComponent } from './dashboard/modals/view-post/view-post.component';
import { CommentComponent } from './dashboard/posts/comment/comment.component';
import { EditCommentComponent } from './dashboard/modals/edit-comment/edit-comment.component';
import { LikesComponent } from './dashboard/likes/likes.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    DashboardComponent,
    NavigationComponent,
    NewsfeedComponent,
    LoadingComponent,
    CreatePostComponent,
    PostComponent,
    EditPostComponent,
    ProfileComponent,
    EditProfileComponent,
    PreviewUserComponent,
    ViewPostComponent,
    CommentComponent,
    EditCommentComponent,
    LikesComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    BrowserAnimationsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return sessionStorage.getItem('token');
        },
        // whitelistedDomains: ['localhost:5000']
      }
    }),
    MatDialogModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-center',
      preventDuplicates: true,
    }),
  ],
  providers: [
    AuthService,
    PostService,
    UserService
  ],
  bootstrap: [AppComponent],
  entryComponents: [CreatePostComponent, EditPostComponent, EditProfileComponent, PreviewUserComponent, ViewPostComponent, EditCommentComponent]
})
export class AppModule { }
