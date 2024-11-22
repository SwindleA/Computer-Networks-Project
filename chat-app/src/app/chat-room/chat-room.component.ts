import { Component,Injectable,ElementRef, ViewChild, OnInit,HostListener } from '@angular/core';
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

var socketURL = "https://localhost:7244/api/Home/UpdateChat"

@Component({
  selector: 'app-chat-room',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule ,MatInputModule,MatButtonModule,MatIconModule,MatTableModule],
  templateUrl: './chat-room.component.html',
  styleUrl: './chat-room.component.css'
})
export class ChatRoomComponent {

    displayedColumns: string[] = ['User', 'Message', 'time','date'];

    dataSource =  new MatTableDataSource<Message>();

    displayData : Message[] = [];

    chat : Chat = {
        chat_id : 0,
        chat_name : '',
        users_in_chat :[],
        messages : []};

    //user : User = {id : 0,name : "", chats : []}; //

    user_id : number = -1;
    chatFormControl  = new FormControl('');

    users_in_chat : Map<number,string> = new Map<number,string>();

    constructor(private api : ApiService,private route: ActivatedRoute){}


    async ngOnInit() {
        
        this.user_id = Number.parseInt(this.route.snapshot.paramMap.get('id')??"0");
        //this.user = await this.api.getUser(tempID);
        
        this.getChat();
    
        this.UpdateChat();

    }

    async sendMessage(){

        const temp = document.getElementById('chat-input') as HTMLInputElement;
        console.log(temp.value)

        var new_message : Message = {user_id: this.user_id,message : "",time : "",date:""};

        new_message.message = temp.value;

        temp.value = "";

        new_message.time = new Date().toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          });
        new_message.date = new Date().toLocaleDateString();

        await this.api.sendMessage(new_message, this.chat);

    }

    async getChat(){
        var chatId = Number.parseInt(this.route.snapshot.paramMap.get('chatid')??"0");
        this.chat  = await this.api.getChat(chatId);
        this.displayData = this.chat.messages;
        this.dataSource.data = this.displayData;
        
        this.chat.users_in_chat.forEach(element => {
            this.users_in_chat.set(element.id,element.name);
        });

        this.scrollChat();
        
        
    }

    async UpdateChat(){
        var chatId = Number.parseInt(this.route.snapshot.paramMap.get('chatid')??"0");
        
            console.log(chatId)

            var socket = new WebSocket(socketURL)
            socket.onopen = function (event) {
                console.log("Socket has been opened!");
                console.log("sending message");
                socket.send(chatId.toString());
            };

            
            socket.onmessage = (event ) =>{
                
                console.log(event)
                this.chat = JSON.parse(event.data);
                console.log(this.chat)
                this.displayData = this.chat.messages;
                this.dataSource.data = this.displayData;
                this.scrollChat();
                
                socket.close()
            };
            
            socket.onclose = (event) =>{
                console.log("reinitiating the socket connection after close")
                console.log(event)
                this.UpdateChat();
            }
        
        
    }


    scrollChat(){
        console.log("scroll")
            setTimeout(() => {
                var objDiv = document.getElementById('messages');
                console.log(objDiv)
                if(objDiv){
                    objDiv.scrollTop = objDiv.scrollHeight;
                }
            },0)
    }

    

}
