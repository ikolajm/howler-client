import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { PostDetailsService } from './post-details.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  postUrl: string = "https://localhost:5001/api/post";
  likeUrl: string = "https://localhost:5001/api/like";
  profileUrl: string = "https://localhost:5001/api/user";
  commentUrl: string = "https://localhost:5001/api/comment";
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
    public authService: AuthService,
    public _postDetailsService: PostDetailsService,
  ) { }

  submit(post) {
    return this._http.post(this.postUrl, post, this.httpOptions).subscribe(newPost => {
      let updatedFeed = this.data.getValue()
      updatedFeed.unshift(newPost)
      this.data.next(updatedFeed);
    })
  }

  getGlobals(): any {
    return this._http.post(this.postUrl + "/view/global", {"Id": this.authService.authorizedUser.id}, this.httpOptions).subscribe(data => {
        this.data.next(data);
      }, error => {
        this.toastr.error("Could not retrieve posts at this time.", "Error");
      }
    )
  }

  getUserLikes() : any {
    return this._http.post(this.postUrl + "/view/likes", {"Id": this.authService.authorizedUser.id}, this.httpOptions).subscribe(data => {
        this.data.next(data);
      }, error => {
        this.toastr.error("Could not retrieve posts at this time.", "Error");
      }
    )
  }

  confirmEdit(post) {
    return this._http.put(this.postUrl + `/${post.id}`, post, this.httpOptions).subscribe(updatedPost => {
      //Get data feed
      let dataFeed = this.data.getValue()
      // Get index of old post within array
      let postIndex = dataFeed.findIndex(postObj => postObj.id === post.id);
      // If post is found
      if (postIndex !== -1) {
        // Use that index to splice out old value, replace with new, updated post
        dataFeed.splice(postIndex, 1, updatedPost);
        // Proceed to use the new data set within service
        this.data.next(dataFeed);
        return { status: "SUCCESS" }
      } else {
        return { status: "ERROR" }
      }
    })
  }

  delete(id) {
    return this._http.delete(this.postUrl + `/${id}`, this.httpOptions).subscribe(data => {
        let post = document.getElementById(`${id}`);
        post.remove();
        return { status: "SUCCESS" }
      }, error => {
        this.toastr.error("Could not delete post at this time.", "Error");
        return { status: "ERROR" }
      }
    )
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
        // Update detailed view modal data
        this._postDetailsService.setPost(postWithNewLikes);
      } else {
        return { status: "ERROR" }
      }
    })
  }

  deleteLike(likeId, postId) {
    return this._http.delete(this.likeUrl + `/${likeId}`, this.httpOptions).subscribe(data => {
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
        // Update detailed view modal data
        this._postDetailsService.setPost(newPostWithLessLikes);
        return { status: "SUCCESS" }
      } else {
        return { status: "ERROR" }
      }
    })
  }

  // Get user posts, likes, comments, etc
  getUserPosts(userId) {
    let userIdObj = {
      "Id": userId
    }
    return this._http.post(this.postUrl + `/user/${userId.toString()}`, userIdObj, this.httpOptions).subscribe(data => {
      this.data.next(data);
    })
  }

  newCommentOnPost(comment) {
    return this._http.post<any>(this.commentUrl, comment, this.httpOptions).subscribe(data => {
      //Get data feed
      let dataFeed = this.data.getValue()
      // Get index of old post within array
      let postIndex = dataFeed.findIndex(postObj => postObj.id == data.postId);
      // If post is found
      if (postIndex !== -1) {
        // Use that index to splice out old value, replace with new, updated post
        let newPostWithMoreComments = {...dataFeed[postIndex]};
        newPostWithMoreComments.commentData.quanity = (dataFeed[postIndex].commentData.quanity + 1);
        newPostWithMoreComments.commentData.commentedByUser = true;
        if (Array.isArray(newPostWithMoreComments.commentData.comments)) {
          newPostWithMoreComments.commentData.comments.push(data);
        } else {
          newPostWithMoreComments.commentData.comments = [data];
        }
        dataFeed.splice(postIndex, 1, newPostWithMoreComments);
        // Proceed to use the new data set within service
        this.data.next(dataFeed);
        // Update detailed view modal data
        this._postDetailsService.setPost(newPostWithMoreComments);
        return { status: "SUCCESS" }
      } else {
        return { status: "ERROR" }
      }
    })
  }

  updateCommentOnPost(comment) {
    return this._http.put<any>(this.commentUrl + "/" + comment.id, { content: comment.content }, this.httpOptions).subscribe(data => {
      //Get data feed
      let dataFeed = this.data.getValue()
      // Get index of old post within array
      let postIndex = dataFeed.findIndex(postObj => postObj.id == data.postId);
      // If post is found
      if (postIndex !== -1) {
        // Use that index to splice out old value, replace with new, updated post
        let newPostWithUpdatedComments = {...dataFeed[postIndex]};
        // Find the correct comment and push new comment in
        let commentIndex = newPostWithUpdatedComments.commentData.comments.findIndex(commentObj => commentObj.id == data.id);
        if (commentIndex !== -1) {
          newPostWithUpdatedComments.commentData.comments.splice(commentIndex, 1, data);
          console.log(newPostWithUpdatedComments)
        } else {

        }
        // newPostWithUpdatedComments.commentData.comments = [data];
        dataFeed.splice(postIndex, 1, newPostWithUpdatedComments);
        // Proceed to use the new data set within service
        this.data.next(dataFeed);
        // Update detailed view modal data
        this._postDetailsService.setPost(newPostWithUpdatedComments);
        return { status: "SUCCESS" }
      } else {
        return { status: "ERROR" }
      }
    })
  }

  deleteCommentOnPost(commentId, postId, userId) {
    return this._http.delete<any>(this.commentUrl + "/" + commentId.toString(), this.httpOptions).subscribe(data => {
      //Get data feed
      let dataFeed = this.data.getValue()
      // Get index of old post within array
      let postIndex = dataFeed.findIndex(postObj => postObj.id == postId);
      // If post is found
      if (postIndex !== -1) {
        // Use that index to splice out old value, replace with new, updated post
        let newPostWithUpdatedComments = {...dataFeed[postIndex]};
        // Find the correct comment and push new comment in
        let commentIndex = newPostWithUpdatedComments.commentData.comments.findIndex(commentObj => commentObj.id == commentId);
        if (commentIndex !== 1) {
          newPostWithUpdatedComments.commentData.comments.splice(commentIndex, 1);
          newPostWithUpdatedComments.commentData.quanity = newPostWithUpdatedComments.commentData.quanity - 1;
          newPostWithUpdatedComments.commentData.commentedByUser = this.checkStillCommentedByUser(newPostWithUpdatedComments.commentData.comments, userId)
        }
        // newPostWithUpdatedComments.commentData.comments = [data];
        dataFeed.splice(postIndex, 1, newPostWithUpdatedComments);
        // Proceed to use the new data set within service
        this.data.next(dataFeed);
        // Update detailed view modal data
        this._postDetailsService.setPost(newPostWithUpdatedComments);
        return { status: "SUCCESS" }
      } else {
        return { status: "ERROR" }
      }
    })
  }
  
  checkStillCommentedByUser(commentArray, userId) {
    let index = commentArray.findIndex(commentObj => commentObj.id === userId);
    console.log(index)
    return (index !== -1);
  }
}
