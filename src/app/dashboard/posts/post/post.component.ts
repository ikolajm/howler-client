import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';
import moment from "moment";
import {MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EditPostComponent } from "../../modals/edit-post/edit-post.component";
import { ViewPostComponent } from "../../modals/view-post/view-post.component";
import { PreviewUserComponent } from '../../modals/preview-user/preview-user.component';
import { PostDetailsService } from 'src/app/services/post-details.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  @Input() post;
  userBackground: string= "";
  postCreatedAt: string = "";
  postCreatedAtExact: string = "";
  isAuthor: boolean = false;
  likes: number = 0;
  likedByUser: boolean = false;
  likeId: number = 0;
  comments: number = 0;
  commentedByUser: boolean = false;
  
  constructor(
    public _authService: AuthService,
    public _postService: PostService,
    public _postDetailsService: PostDetailsService,
    private postDialog: MatDialog
  ) { }
  
  ngOnInit() {
    this.userBackground = "#" + this.post.user.avatarBackground;
    this.postCreatedAt = moment(this.post.createdAt).fromNow();
    this.postCreatedAtExact = moment(this.post.createdAt).format('MMMM Do YYYY, h:mm:ss a');
    this.isAuthor = this.post.userId === this._authService.authorizedUser.id;
    this.likedByUser = this.post.likeData.likedByUser;
    this.likes = this.post.likeData.quanity;
    this.likeId = this.post.likeData.likeId;
    this.comments = this.post.commentData.quanity
    this.commentedByUser = this.post.commentData.commentedByUser
  }

  openEditDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '300px';
    dialogConfig.data = {
      // Post content
      content: this.post.content,
      // Post privacy
      private: this.post.hidden,
      // Post Id
      id: this.post.id,
      // Post authorId
      userId: this.post.userId
    }
    this.postDialog.open(EditPostComponent, dialogConfig);
  }

  likePost() {
    this._postService.likePost(this.post.id, this._authService.authorizedUser.id);
  }

  unlikePost() {
    this._postService.deleteLike(this.likeId, this.post.id);
  }

  openPreviewUserDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '300px';
    dialogConfig.height = "300px";
    dialogConfig.data = {
      // User Id
      id: this.post.user.id,
      // Name
      name: this.post.user.name,
      // Username
      username: this.post.user.username,
      // avatarBackground
      userBackground: "#" + this.post.user.avatarBackground,
      // Postcount
      postCount: this.post.user.postCount
      // FollowData
        // FollowCount
        // FollowedByUser
    }
    this.postDialog.open(PreviewUserComponent, dialogConfig);
  }

  openFullPostView() {
    // Go to post details service and get new value
    this._postDetailsService.setPost(this.post);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '90%';
    dialogConfig.maxWidth = '1000px';
    dialogConfig.height = "auto";
    dialogConfig.maxHeight = "90vh";
    dialogConfig.panelClass = 'viewPostModal'
    //dialogConfig.data = {
      //post: this.post
    //}
    this.postDialog.open(ViewPostComponent, dialogConfig);
  }
}
