import { Component, OnInit, Input } from '@angular/core';
import moment from "moment";
import { AuthService } from 'src/app/services/auth.service';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog} from "@angular/material";
import { PreviewUserComponent } from '../../modals/preview-user/preview-user.component';
import { EditCommentComponent } from '../../modals/edit-comment/edit-comment.component';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  @Input() comment;
  id: number = 0;
  content: string = "";
  edited: boolean = false;
  createdAt: string = "";
  userId: number = 0;
  name: string = "";
  username: string = "";
  userBackground: string = "";
  userPostCount: number = 0;
  isAuthor: boolean = false;


  constructor(
    private userDialog: MatDialog,
    private auth: AuthService
  ) { }

  ngOnInit() {
    console.log(this.comment)
    this.id = this.comment.id;
    this.content = this.comment.content;
    this.edited = this.comment.edited;
    this.createdAt = moment(this.comment.createdAt).fromNow();
    this.userId = this.comment.user.id;
    this.name = this.comment.user.name;
    this.username = this.comment.user.username;
    this.userBackground = "#" + this.comment.user.avatarBackground;
    this.userPostCount = this.comment.user.postCount;
    this.isAuthor = this.comment.user.id === this.auth.authorizedUser.id;
  }

  openPreviewCommentUserDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '300px';
    dialogConfig.height = "300px";
    dialogConfig.data = {
      // User Id
      id: this.userId,
      // Name
      name: this.name,
      // Username
      username: this.username,
      // avatarBackground
      userBackground: this.userBackground,
      // Postcount
      postCount: this.userPostCount
      // FollowData
        // FollowCount
        // FollowedByUser
    }
    this.userDialog.open(PreviewUserComponent, dialogConfig);
  }

  openEditDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '300px';
    dialogConfig.height = "300px";
    dialogConfig.data = {
      // Comment Id
      commentId: this.id,
      // Content
      content: this.content,
      // User
      userId: this.userId,
      // Post
      postId: this.comment.postId
    }
    this.userDialog.open(EditCommentComponent, dialogConfig);
  }

}
