import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import { ToastrService } from 'ngx-toastr';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-edit-comment',
  templateUrl: './edit-comment.component.html',
  styleUrls: ['./edit-comment.component.scss']
})
export class EditCommentComponent implements OnInit {
  commentId:number = 0;
  oldCommentContent: string = "";
  content: string = "";
  author: number = 0;
  postId: number = 0

  constructor(
    public toastr: ToastrService,
    public postService: PostService,
    private dialogRef: MatDialogRef<EditCommentComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.commentId = data.commentId;
    this.oldCommentContent = data.content;
    this.content = data.content;
    this.author = data.userId;
    this.postId = data.postId;
  }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
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

  submitEdit() {
    if (this.content.length > 0) {
      if (this.content !== this.oldCommentContent) {
        let obj = {
          "id": this.commentId,
          "content": this.content
        }
        this.postService.updateCommentOnPost(obj);
        this.toastr.success("Comment edited successfully", "Success")
        this.close();
      } else {
        return this.toastr.error("There must be new content to submit an edit");
      }
    } else {
      return this.toastr.error("There must be content to submit an comment");
    }
  }
 
  confirmDelete() {
    this.postService.deleteCommentOnPost(this.commentId, this.postId, this.author);
    this.close();
    this.toastr.success("Comment was successfully deleted!", "Success");
  }
}
