import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import {Router} from '@angular/router';
import {MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CreatePostComponent } from "../modals/create-post/create-post.component";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  user: any = null
  hasProfilePicture: boolean = false;
  userBackground: string= "";
  profileLink: string = ""

  constructor(
    private auth: AuthService, 
    private router: Router,
    private postDialog: MatDialog) { }

  ngOnInit() {
    this.user = this.auth.authorizedUser;
    this.hasProfilePicture = !this.user.avatarURL === null;
    this.userBackground = "#" + this.user.avatarBackground;
    this.profileLink = './profile/' + this.auth.authorizedUser.id.toString();
  }

  async logout() {
    let result = await this.auth.logout();
    this.router.navigateByUrl('authentication')
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '300px';
    this.postDialog.open(CreatePostComponent, dialogConfig);
  }

}
