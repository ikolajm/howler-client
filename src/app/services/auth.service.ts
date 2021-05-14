import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthUser } from '../models/AuthUser';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
    httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
    }
    decodedToken: any;
    baseUrl: string = 'https://localhost:5001/api/auth/';
    authorizedUser: any = null

    constructor(private _http: HttpClient, private _jwtHelperService: JwtHelperService) { }

    login(model: any) {
        return this._http.post<AuthUser>(this.baseUrl + 'login', model, this.httpOptions)
            .pipe(map(user => {
              if (user) {
                sessionStorage.setItem('token', user.token);
                this.decodedToken = this._jwtHelperService.decodeToken(user.token);
                this.authorizedUser = user.user;
                return true
              }
            }));
    }

    signup(model: any) {
        return this._http.post<AuthUser>(this.baseUrl + 'register', model, this.httpOptions)
            .pipe(map(user => {
              if (user) {
                sessionStorage.setItem('token', user.token);
                this.decodedToken = this._jwtHelperService.decodeToken(user.token);
                this.authorizedUser = user.user;
                return true
              }
            }));
    }

    getUserFromToken(userId: number, token: string) {
        return this._http.get(this.baseUrl + `${userId}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        })
    }

    isAuthorizedUser() {
        return this.authorizedUser && this.authorizedUser.Id !== null;
    }

    logout() {
        this.authorizedUser = null;
        this.decodedToken = null;
        sessionStorage.removeItem("token");
        return true;
    }
}