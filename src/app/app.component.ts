import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";
import { AuthService } from "./services/auth.service";
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title: string = 'Howler';
  hasUser: boolean = false;

  constructor(
    private _authService: AuthService,
    private _jwtHelperService: JwtHelperService,
    private toastr: ToastrService,
    private router: Router) {}

  ngOnInit() {
    this.checkToken()
  }

  async checkToken() {
    const token = sessionStorage.getItem('token');

    if (token) {
      //this.toastr.success("Token found, logging you back in!", "Success")
      // setTimeout(async () => {
        this._authService.decodedToken = await this._jwtHelperService.decodeToken(token);
        let userId = this._authService.decodedToken.nameid;
        this._authService.getUserFromToken(userId, token).subscribe(data => {
          this.updateUserFromToken(data);
        }, error => {
          return this.toastr.error("Could not automatically log you in at this time", "Error")
        });
      // }, 1000)
    }
  }

  updateAuthUser(obj: any) {
    let { Id, name, username, email, avatarBackground, avatarURL } = obj.user;
    let _authUser: any = {
      Id, name, username, email, avatarBackground, avatarURL 
    }
    this.toastr.success("See you inside!", "Success");
    this._authService.authorizedUser = _authUser;
    setTimeout(() => {
      this.router.navigateByUrl('/dashboard/newsfeed');
    }, 3000);
  }

  updateUserFromToken(obj: any) {
    this._authService.authorizedUser = obj.user;
    this.router.navigateByUrl('/dashboard/newsfeed');
  }
}
