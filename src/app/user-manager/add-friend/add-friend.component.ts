import { Component, Inject } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { Observable, empty } from 'rxjs';
import { user } from 'src/models/user';

@Component({
  selector: 'app-add-friend',
  templateUrl: './add-friend.component.html',
  styleUrls: ['./add-friend.component.css']
})
export class AddFriendComponent {

  friendsResults: Observable<user[]>;

  currentRequests: string[];

  resultsLength: number;

  constructor(private auth: AuthService, @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {
    this.getPendingRequests()
  }

  searchForFriendsKeydown(event: any) {
    if (event.key == 'Enter') {
      this.searchForFriends(event.target.value);
    }
  }

  searchForFriends(keyword: string) {
    if (keyword == "") {
      this.friendsResults = empty();
    } else {
      this.friendsResults = this.auth.searchForFriends(this.data.user, keyword)
      this.friendsResults.subscribe((results) => {
        this.resultsLength = results.length;
      })
    }
  }

  sendFriendRequest(recipientUid: string) {
    this.auth.sendFriendRequest(this.data.user, recipientUid)
  }

  undoFriendRequest(recipientUid: string) {
    this.auth.undoFriendRequest(this.data.user, recipientUid)
  }

  getPendingRequests() {
    this.auth.getSentRequests(this.data.user).subscribe((user) => {
      this.currentRequests = user.pendingFriends
    })
  }
}
