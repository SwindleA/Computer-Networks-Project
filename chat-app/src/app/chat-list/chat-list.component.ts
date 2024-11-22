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

    chats : string[] = [];

    user : User = {id : 0,name : "", chats : []};;

    constructor(private api : ApiService,private router : Router) { }

    async ngOnInit()
    {
        console.log(this.user_id);
        this.user = await this.api.getUser(this.user_id);
        for(const key in this.user.chats){
            console.log(this.user.chats[key])
            this.chats.push(this.user.chats[key])
            
        }
        
        
        console.log(this.chats)
        

    }

    goToChat(chatName : string){

        console.log("go to chat")
        console.log(chatName)
console.log(this.user)
        for (const key in this.user.chats) {
            console.log(this.user.chats[key])
            if (this.user.chats[key] === chatName) {
              window.location.href = '/user/'+this.user_id+'/chat_room/'+key; 
            }
          }
       
    }


}
