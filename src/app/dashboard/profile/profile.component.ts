import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';
import {MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from "@angular/router";
import { EditProfileComponent } from "../modals/edit-profile/edit-profile.component";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userId: number = 0;
  user: any = null;
  loading: boolean = true;
  postData: any = null;

  constructor(
    public _authService: AuthService,
    public _postService: PostService,
    public _userService: UserService,
    private editProfile: MatDialog,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // Get the user data by url parameter
    this.route.paramMap.subscribe(params => {
      this.userId = Number(params.get("id"));
      // Get user info
      this._userService.getUserInfo(this.userId);
      this._userService.user$.subscribe(data => this.user = data);
      // Set user posts to data
      this._postService.getUserPosts(this.userId);
      // Subscribe to data and link to this.postData
      this._postService.data$.subscribe(data => this.postData = data);
      setTimeout(() => {
        // Set loading false
        this.loading = false;
      }, 300)
    })
  }

  backToTop() {
    let newsfeed = document.querySelector(".scrollableContent");
    newsfeed.scrollTop = 0;
  }

  backToTopCheck() {
    let newsfeed = document.querySelector(".scrollableContent");
    let button = document.querySelector("#backToTopButton");
    if (newsfeed.scrollTop >= 10) {
      button.setAttribute("style", "opacity:1;")
    } else {
      button.setAttribute("style", "opacity:0;")
    }
  }

  openEditProfileDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '300px';
    dialogConfig.maxWidth = '95vw';
    dialogConfig.maxHeight = '95vh';
    dialogConfig.height = '400px';
    dialogConfig.width = '350px';
    dialogConfig.data = {
      // Id
      id: this.user.id,
      // Name
      name: this.user.name,
      // Username
      username: this.user.username,
      // BackgroundColor
      backgroundColor: this.user.userBackground
    }
    this.editProfile.open(EditProfileComponent, dialogConfig);
  }

}
