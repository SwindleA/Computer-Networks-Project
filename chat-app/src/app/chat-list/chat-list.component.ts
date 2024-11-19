import { Component,Input} from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { ApiService } from '../api.service';
import { Chat } from '../DataStructures/chat';
import { Router } from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import { User } from '../DataStructures/user';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [MatSidenavModule,MatIconModule,MatButtonModule,MatCardModule],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.css'
})
export class ChatListComponent {

    @Input() user_id = -1;

    opened: boolean = false;

    chats : number[] = [];

  

    constructor(private api : ApiService,private router : Router) { }

    async ngOnInit()
    {
        console.log(this.user_id);
        var user : User = await this.api.getUser(this.user_id);
        this.chats = user.chats;
        console.log(this.chats)
        

    }

    goToChat(chat : number){

        console.log("go to chat")
        console.log(chat)
       window.location.href = '/'+this.user_id+'/chat_room/'+chat;
    }


}
