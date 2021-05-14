import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-likes',
  templateUrl: './likes.component.html',
  styleUrls: ['./likes.component.scss']
})
export class LikesComponent implements OnInit {
  data: any = null;
  loading: boolean = true;

  constructor(
    public authService: AuthService,
    public postService: PostService
  ) { }

  ngOnInit() {
    let newsfeed = document.querySelector(".newsfeed");
    newsfeed.setAttribute("style", "border-left: 2px solid #f5feff73; border-right: 2px solid #f5feff73;")
    setTimeout(() => {
      this.postService.getUserLikes();
      this.postService.data$.subscribe(data => this.data = data)
      console.log(this.data)
      newsfeed.setAttribute("style", "border-left: none; border-right: none;")
      this.loading = false;
    }, 300);
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
