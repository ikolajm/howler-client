import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  userId = "";
  name = "";
  username = "";
  userBackground = "";
  red = "#F24951";
  blue = "#6464ED";
  green ="#65F088";
  pink = "#F07E84";
  purple = "#CC71F0";
  orange = "#F59D5A";

  constructor(
    private dialogRef: MatDialogRef<EditProfileComponent>,
    private userService: UserService,
    public toastr: ToastrService,
    public authService: AuthService,
    public postService: PostService,
    @Inject(MAT_DIALOG_DATA) data)
    { 
      this.userId = data.id;
      this.name = data.name;
      this.username = data.username;
      this.userBackground = data.backgroundColor;
    }

  ngOnInit() {
  }

  isActiveColor(hexCode) {
    return hexCode === this.userBackground;
  }

  setNewBackground(string) {
    this.userBackground = string;
  }

  close() {
    this.dialogRef.close();
  }

  saveEdit() {
    // Check name length
    if (this.name.length > 26) {
      return this.toastr.error("Please ensure that your name is under 27 characters", "Error")
    }
    // Check username length
    if (this.username.length > 16) {
      return this.toastr.error("Please ensure that your username is under 17 characters", "Error")
    }
    let croppedHexCode = this.userBackground.substring(1);
    let editObj = {
      name: this.name,
      username: this.username,
      avatarBackground: croppedHexCode
    }
    this.userService.confirmProfileEdit(this.userId, editObj);
    this.close();
    this.toastr.success("Post was updated successfully", "Success");
    this.userService.getUserInfo(this.userId);
    this.postService.getUserPosts(this.userId);
  }
 }
