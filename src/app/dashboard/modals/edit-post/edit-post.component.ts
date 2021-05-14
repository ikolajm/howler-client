import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import { PostService } from 'src/app/services/post.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss']
})
export class EditPostComponent implements OnInit {
  postId = "";
  postContent = "";
  postPrivacy = "";
  postAuthor = "";
  public = "public";
  private = "private";
  oldPostContent = "";
  oldPostPrivacy: boolean = false;


  constructor(
    private dialogRef: MatDialogRef<EditPostComponent>,
    public postService: PostService,
    public toastr: ToastrService,
    public authService: AuthService,
    @Inject(MAT_DIALOG_DATA) data) { 
      this.postId = data.id;
      this.oldPostContent = data.content;
      this.postContent = data.content;
      this.postPrivacy = (data.private === false) ? "public" : "following"; 
      this.oldPostPrivacy = data.private;
      this.postAuthor = data.userId;
    }

  ngOnInit() {
  }

  checkPrivacy(string) {
    if (this.postPrivacy == string) {
      return "icon activeIcon";
    } else {
      return "icon"
    }
  }

  modifyPrivacy(string) {
    this.postPrivacy = string;
  }

  close() {
    this.dialogRef.close();
  }

  saveEdit() {
    let postObj = {
      id: this.postId,
      content: this.postContent,
      hidden: (this.postPrivacy === "public") ? false : true,
      edited: (this.postContent !== this.oldPostContent) ? true : false,
      UserId: this.postAuthor
    }

    if (postObj.edited !== true && postObj.hidden === this.oldPostPrivacy) {
      return this.toastr.error("To submit an edit you must make a change to the post.", "Error")
    }

    this.postService.confirmEdit(postObj);
    this.close();
    this.toastr.success("Post was updated successfully", "Success");
  }

  revealDeleteConfirmation() {
    let ays = document.querySelector("#areYouSure");
    let confirmationContainer = document.querySelector(".confirmationContainer");
    let confirmationButtons = document.querySelectorAll(".confirmationButton");
    confirmationButtons.forEach(button => {
      button.removeAttribute("disabled")
    })
    ays.setAttribute("style", "opacity: 1;")
    confirmationContainer.setAttribute("style", "opacity: 1;")
  }

  cancelDelete() {
    let ays = document.querySelector("#areYouSure");
    let confirmationContainer = document.querySelector(".confirmationContainer");
    let confirmationButtons = document.querySelectorAll(".confirmationButton");
    confirmationButtons.forEach(button => {
      button.setAttribute("disabled", "true")
    })
    ays.setAttribute("style", "opacity: 0;")
    confirmationContainer.setAttribute("style", "opacity: 0;")
  }

  confirmDelete() {
    this.postService.delete(this.postId);
    this.close();
    this.toastr.success("Post was successfully deleted!", "Success");
  }

}
