import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PreviewUserService {
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
}
