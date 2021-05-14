import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {
  public: string = "public";
  following: string = "following";
  privacy: string = "public";
  postContent: string = "";

  constructor(
    public dialogRef: MatDialogRef<CreatePostComponent>, 
    public toastr: ToastrService,
    public authService: AuthService,
    public postService: PostService) { }

  ngOnInit() {
  }

  close() {
    this.privacy = "public";
    this.postContent = "";
    this.dialogRef.close();
  }

  checkPrivacy(string) {
    if (this.privacy == string) {
      return "icon activeIcon";
    } else {
      return "icon"
    }
  }

  modifyPrivacy(string) {
    this.privacy = string;
  }

  async submitPost() {
    if (this.postContent.trim() === "") {
      return this.toastr.error("Post needs content to be posted", "Error")
    } else if (this.postContent.trim().length > 150) {
      return this.toastr.error("Post can only have a maximum of 150 characters", "Error")
    } else {
      let postObj = {
        "content": this.postContent,
        "hidden": (this.privacy === "public" ? false : true),
        "UserId": this.authService.authorizedUser.id
      }
      this.postService.submit(postObj)
      this.close()
      this.toastr.success("Post successfully submitted", "Success")
    }
  }
}
