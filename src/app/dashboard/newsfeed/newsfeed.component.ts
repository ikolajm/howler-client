import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-newsfeed',
  templateUrl: './newsfeed.component.html',
  styleUrls: ['./newsfeed.component.scss']
})
export class NewsfeedComponent implements OnInit {
  loading: boolean = true;
  data: any = null;
  global: string = "global";
  following: string = "following";
  activeFilter: string = "global";

  constructor(
    public toastr: ToastrService,
    public authService: AuthService,
    public postService: PostService
  ) { }

  ngOnInit() {
    let newsfeed = document.querySelector(".newsfeed");
    newsfeed.setAttribute("style", "border-left: 2px solid #f5feff73; border-right: 2px solid #f5feff73;")
    setTimeout(() => {
      this.postService.getGlobals();
      this.postService.data$.subscribe(data => this.data = data)
      newsfeed.setAttribute("style", "border-left: none; border-right: none;")
      this.loading = false;
    }, 300);
  }

  filterCheck(string: string) {
    if (this.activeFilter == string) {
      return "active"
    } else {
      return ""
    }
  }

  modifyFilter(string: string) {
    this.activeFilter = string;
  }

  backToTop() {
    let newsfeed = document.querySelector(".newsfeed");
    newsfeed.scrollTop = 0;
  }

  backToTopCheck() {
    let newsfeed = document.querySelector(".newsfeed");
    let button = document.querySelector("#backToTopButton");
    if (newsfeed.scrollTop >= 10) {
      button.setAttribute("style", "opacity:1;")
    } else {
      button.setAttribute("style", "opacity:0;")
    }
  }

}
