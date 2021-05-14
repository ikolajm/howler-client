import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { PostService } from '../../../services/post.service';
import { PreviewUserService } from '../../../services/preview-user.service';
import {MatDialog, MatDialogConfig, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from "@angular/router";
import { EditProfileComponent } from "../edit-profile/edit-profile.component";

@Component({
  selector: 'app-preview-user',
  templateUrl: './preview-user.component.html',
  styleUrls: ['./preview-user.component.scss']
})
export class PreviewUserComponent implements OnInit {
  userId: number = 0;
  user: any = null;
  routerlink: string = "";

  constructor(
    public _authService: AuthService,
    public _postService: PostService,
    public _userService: PreviewUserService,
    private userPreview: MatDialogRef<PreviewUserComponent>,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) data
    ) {
      console.log(data)
      this.user = data;
    }

  ngOnInit() {
    this.userId = this.user.id;
    this.routerlink = '/dashboard/profile/' + this.userId.toString();
  }

  close() {
    this.userPreview.close();
  }
 }
