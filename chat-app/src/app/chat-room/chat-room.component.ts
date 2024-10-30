import { Component,Injectable } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl,FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import { ApiService } from '../api.service';
import { Chat } from '../DataStructures/chat';
import { Message } from '../DataStructures/message';
import { User } from '../DataStructures/user';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat-room',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule ,MatInputModule,MatButtonModule,MatIconModule,MatTableModule],
  templateUrl: './chat-room.component.html',
  styleUrl: './chat-room.component.css'
})
export class ChatRoomComponent {

    displayedColumns: string[] = ['User', 'Message', 'time'];

    dataSource =  new MatTableDataSource<Message>();

    displayData : Message[] = [];

    chat : Chat = {
        chat_id : 0,
        users_in_chat :[],
        messages : []};

    user : User = {id : 0,name : "", chats : []};

    chatFormControl  = new FormControl('');

    async ngOnInit() {
        
        var tempID = Number.parseInt(this.route.snapshot.paramMap.get('id')??"0");
        this.user = await this.api.getUser(tempID);
        
        this.getChat();
    
        this.UpdateChat();

    }

    constructor(private api : ApiService,private route: ActivatedRoute){


    }

    async sendMessage(){

        const temp = document.getElementById('chat-input') as HTMLInputElement;
        console.log(temp.value)

        var new_message : Message = {user: this.user,message : "",time : ""};

        new_message.message = temp.value;

        temp.value = "";

        

        new_message.time = new Date().toISOString();

        await this.api.sendMessage(new_message, this.chat);


    }

    async getChat(){
        var chatId = Number.parseInt(this.route.snapshot.paramMap.get('chatid')??"0");
        this.chat  = await this.api.getChat(chatId);
        this.displayData = this.chat.messages;//this.chat.messages;
        this.dataSource.data = this.displayData;
    }

    async UpdateChat(){
        while(true){
            var chatId = Number.parseInt(this.route.snapshot.paramMap.get('chatid')??"0");
            this.chat  = await this.api.UpdateChat(chatId);
            this.displayData = this.chat.messages;//this.chat.messages;
            this.dataSource.data = this.displayData;
        }
        
    }

}
