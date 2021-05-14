import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog} from "@angular/material";
import moment from "moment";
import { PreviewUserComponent } from '../../modals/preview-user/preview-user.component';
import { PostService } from '../../../services/post.service';
import { AuthService } from '../../../services/auth.service';
import { PostDetailsService } from '../../../services/post-details.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.scss']
})
export class ViewPostComponent implements OnInit {
  loading: boolean = true;
  id: number = 0;
  userId: number = 0;
  userBackground: string = "";
  name: string = "";
  username: string = "";
  postCount: number = 0;
  createdAt: string = ""
  edited: boolean = false;
  content: string = "";
  likedByUser: boolean = false;
  likes: number = 0;
  likeId: number = 0;
  commentContent: string = "";
  commentedByUser: boolean = false;
  comments: number = 0;
  commentData: any = {};


  constructor(
    private userDialog: MatDialog,
    private viewPost: MatDialogRef<ViewPostComponent>,
    public _postService: PostService,
    public _postDetailsService: PostDetailsService,
    public _authService: AuthService,
    public toastr: ToastrService
    //@Inject(MAT_DIALOG_DATA) post
  ) {
    
  }

  ngOnInit() {
    this._postDetailsService.data$.subscribe(data => 
      {
        this.id = data.id
        // Inject all post data here
        this.id = data.id
        this.userId = data.user.id;
        this.userBackground = "#" + data.user.avatarBackground;
        this.name = data.user.name;
        this.username = data.user.username;
        this.postCount = data.user.postCount;
        this.createdAt = moment(data.createdAt).fromNow();
        this.edited = data.edited;
        this.content = data.content;
        this.likedByUser= data.likeData.likedByUser;
        this.likes = data.likeData.quanity;
        this.likeId = data.likeData.likeId;
        this.commentedByUser = data.commentData.commentedByUser;
        this.comments = data.commentData.quanity;
        this.commentData = data.commentData.comments;
        this.loading = false;
      }
    )
  }

  backToTop() {
    let dialogContent = document.querySelector(".mat-dialog-content");
    dialogContent.scrollTop = 0;
  }

  backToTopCheck() {
    let dialogContent = document.querySelector(".mat-dialog-content");
    let button = document.querySelector("#dialogBackToTopButton");
    if (dialogContent.scrollTop >= 10) {
      button.setAttribute("style", "opacity:1;")
    } else {
      button.setAttribute("style", "opacity:0;")
    }
  }

  openPreviewAuthorDialog() {
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
      postCount: this.postCount,
      // FollowData
        // FollowCount
        // FollowedByUser
    }
    this.userDialog.open(PreviewUserComponent, dialogConfig);
  }

  likePost() {
    this._postService.likePost(this.id, this._authService.authorizedUser.id);
  }

  unlikePost() {
    this._postService.deleteLike(this.likeId, this.id);
  }

  close() {
    this.viewPost.close();
  }

  postComment() {
    if (this.commentContent.length > 0) {
      let commentBody = {
        content: this.commentContent,
        PostId: this.id,
        UserId: this._authService.authorizedUser.id
      }
      this._postService.newCommentOnPost(commentBody);
      this.commentContent = "";
    } else {
      this.toastr.error("You must have content to post your comment", "Error");
    }
  }

}
