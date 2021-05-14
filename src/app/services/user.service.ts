import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  profileUrl: string = "https://localhost:5001/api/user";
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      "Authorization": "Bearer " + sessionStorage.getItem("token")
    })
  }
  user = new BehaviorSubject(null);
  user$ = this.user.asObservable();

  constructor(
    private _http: HttpClient,
    public authService: AuthService
  ) { }

  getUserInfo(userId) {
    return this._http.post(this.profileUrl + `/view/${userId}`, {"Id": userId}, this.httpOptions).subscribe(data => {
        let newData = {...data};
        let backgroundString = "#" + newData["userBackground"];
        newData["userBackground"] = backgroundString;
        newData["isAuthUser"] = this.authService.authorizedUser.id === userId ? true : false;
        this.user.next(newData)
      }, error => {
        //this.toastr.error("Could not retrieve posts at this time.", "Error");
      }
    )
  }

  confirmProfileEdit(id, editObj) {
    return this._http.put<any>(this.profileUrl + `/edit/${id}`, editObj, this.httpOptions).subscribe(updatedUser => {
      // Update auth user
      this.authService.authorizedUser = updatedUser;
      // Due to issues creating authUser into observable item to subscribe to, update dom properties
      let navigation = document.querySelector(".navigation");
      let userContainer = navigation.querySelector(".userContainer");
      let profile = userContainer.querySelector(".profile");
        // Profile background color
        let avatarBackground = profile.querySelector(".background");
        avatarBackground.setAttribute("style", "background: #" + updatedUser.userBackground );
        // Profile username
        let username = userContainer.querySelector(".username");
        username.textContent = updatedUser.username
      // Update the profile screen
      this.user.next(updatedUser);
    })
  }
}
