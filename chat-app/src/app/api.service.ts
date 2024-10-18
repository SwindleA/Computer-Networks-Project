import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from './DataStructures/message';
import { Chat } from './DataStructures/chat';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

    public userId :string = "";

    EOM : string = "<|EOM|>";

    UID :string = "<|UID|>";

    CHATID : string = "<|CHATID|>";

    MES : string = "<|MES|>"

  constructor(private httpClient : HttpClient) { }

 

    async getUser(id : number){
        console.log("get user");

        try{
            const response = await fetch("https://localhost:7244/api/Home/GetUser?id="+id,{
                headers : new Headers({'content-type' :'application/json'}),
                mode : 'cors'
            });

            const data = await response.json()
            console.log(data) 
            return data;
        }catch(error){
            console.log(error);
        }
    }

    public async sendMessage(message : Message, chat : Chat){
        

        var pack : string = JSON.stringify(message)

        console.log(pack)
        try{
            const response = await fetch("https://localhost:7244/api/Home/SendMessage?chat_id="+chat.chat_id,{
                method : 'POST',
                mode : 'cors',
                headers : new Headers({'content-type' :'application/json'}),
                body : pack
            })
            const data = await response.json()
            console.log(data) 
            return data;
        }catch(error){
            console.log(error);
        }

    }

    public async UpdateChat(chatId : number){
        console.log("update chat listener");

        try{
            const response = await fetch("https://localhost:7244/api/Home/UpdateChat?id="+chatId,{
                headers : new Headers({'content-type' :'application/json'}),
                mode : 'cors'
            });

            const data = await response.json()
            console.log(data) 
            return data;
        }catch(error){
            console.log(error);
        }
    }

    public async getChat(chatId : number){
        console.log("get chat");

        try{
            const response = await fetch("https://localhost:7244/api/Home/GetChat?id="+chatId,{///api/Home/GetChat?id="+123,{
                headers : new Headers({'content-type' :'application/json'}),
                mode : 'cors'
            });

            const data = await response.json()
            console.log(data) 
            return data;
        }catch(error){
            console.log(error);
        }
                   
            
    

        // return {
        //     "chat_id": 123,
        //     "IP": "192.168.1.1",
        //     "users_in_chat": [
        //         { 
        //             "id": 1, 
        //             "name": "John", 
        //             "IP": "192.168.1.10", 
        //             "chats": [123, 456] 
        //         },
        //         { 
        //             "id": 2, 
        //             "name": "Jane", 
        //             "IP": "192.168.1.11", 
        //             "chats": [123] 
        //         }
        //     ],
        //     "messages": [
        //         { 
        //             "user": { 
        //                 "id": 1, 
        //                 "name": "John", 
        //                 "IP": "192.168.1.10", 
        //                 "chats": [123, 456] 
        //             }, 
        //             "message": "Hello", 
        //             "time": "2023-10-16T14:00:00Z" 
        //         },
        //         { 
        //             "user": { 
        //                 "id": 2, 
        //                 "name": "Jane", 
        //                 "IP": "192.168.1.11", 
        //                 "chats": [123] 
        //             }, 
        //             "message": "Hi!", 
        //             "time": "2023-10-16T14:05:00Z" 
        //         }
        //     ]
        // }
        
    }
        



}
