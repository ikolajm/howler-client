import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import colorGen from "../helpers/backgroundColorGenerator";
import { AuthService } from '../services/auth.service';
import { Output, EventEmitter } from '@angular/core';
import { AuthUser } from '../models/AuthUser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  user: any = {
    name: "",
    email: "",
    username: "",
    password: "",
    confirm: ""
  };
  showLogin: boolean = true;
  
  constructor(
    private toastr: ToastrService, 
    public authService: AuthService,
    private router: Router) { }
  ngOnInit() {}
  
  toggleForm() {
    this.showLogin = !this.showLogin
  }

  checkInputs(string) {
    // If logging in
    if (string === "login") {
      // If fields not filled in - alert
      if (
        this.user.username.trim() === "" ||
        this.user.password.trim() === ""
        ) {
        return this.toastr.error("Please make sure both fields are filled in", "Error")
      }
    }
    
    // If signing up
    if (string === "signup") {
      // If fields are empty
      if (
        this.user.name.trim() === "" ||
        this.user.email.trim() === "" ||
        this.user.username.trim() === "" ||
        this.user.password.trim() === "" ||
        this.user.confirm.trim() === ""
      ) {
        return this.toastr.error("Please make sure all fields are filled in", "Error")
      // If passwords do not match
      } else if (this.user.password.trim() !== this.user.confirm.trim()) {
        return this.toastr.error("Please make sure both password fields match", "Error")
      }
    }

    return "pass";
  }

  async login() {
    let test = this.checkInputs("login")
    if (test === "pass") {
      this.authService.login(this.user).subscribe(data => {
        this.router.navigateByUrl('dashboard/newsfeed');
      }, error => {
        return this.toastr.error("Could not log you in at this time", "Error")
      });
    }
  }

  async signup() {
    let test = this.checkInputs("signup")
    if (test === "pass") {
      this.authService.signup(this.user).subscribe(data => {
        console.log('logged in successfully', data);
      }, error => {
        return this.toastr.error("Could not log you in at this time", "Error")
      });
    }
  }

}
