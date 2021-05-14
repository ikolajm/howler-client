import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostDetailsService {
  postUrl: string = "https://localhost:5001/api/post";
  likeUrl: string = "https://localhost:5001/api/like";
  profileUrl: string = "https://localhost:5001/api/user";
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      "Authorization": "Bearer " + sessionStorage.getItem("token")
    })
  }
  data = new BehaviorSubject(null);
  data$ = this.data.asObservable();

  constructor(
    private _http: HttpClient,
    public toastr: ToastrService,
    public authService: AuthService
  ) { }

  setPost(postObj) {
    this.data.next(postObj)
  }

  likePost(postId, userId) {
    let likeBody = {
      "PostId": postId,
      "UserId": userId
    }
    return this._http.post(this.likeUrl, likeBody, this.httpOptions).subscribe(postWithNewLikes => {
      //Get data feed
      let dataFeed = this.data.getValue()
      // Get index of old post within array
      let postIndex = dataFeed.findIndex(postObj => postObj.id === postId);
      // If post is found
      if (postIndex !== -1) {
        // Use that index to splice out old value, replace with new, updated post
        dataFeed.splice(postIndex, 1, postWithNewLikes);
        // Proceed to use the new data set within service
        this.data.next(dataFeed);
      } else {
        return { status: "ERROR" }
      }
    })
  }

  deleteLike(likeId, postId) {
    return this._http.delete(this.likeUrl + `/${likeId}`, this.httpOptions).subscribe(data => {
      console.log(data)
      //Get data feed
      let dataFeed = this.data.getValue()
      // Get index of old post within array
      let postIndex = dataFeed.findIndex(postObj => postObj.id == postId);
      // If post is found
      if (postIndex !== -1) {
        // Use that index to splice out old value, replace with new, updated post
        let newPostWithLessLikes = {...dataFeed[postIndex]};
        newPostWithLessLikes.likeData.quanity = (dataFeed[postIndex].likeData.quanity - 1);
        newPostWithLessLikes.likeData.likedByUser = false;
        newPostWithLessLikes.likeData.likeId = 0;
        dataFeed.splice(postIndex, 1, newPostWithLessLikes);
        // Proceed to use the new data set within service
        this.data.next(dataFeed);
        return { status: "SUCCESS" }
      } else {
        return { status: "ERROR" }
      }
    })
  }
}
