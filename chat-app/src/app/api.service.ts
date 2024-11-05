import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from './DataStructures/message';
import { Chat } from './DataStructures/chat';

const url_get_user = "https://localhost:7244/api/Home/GetUser?id="
const url_send_message = "https://localhost:7244/api/Home/SendMessage?chat_id="
const url_get_chat = "https://localhost:7244/api/Home/GetChat?id="

@Injectable({
  providedIn: 'root'
})
export class ApiService {

    public userId :string = "";

  constructor(private httpClient : HttpClient) { } 

    async getUser(id : number){
        console.log("get user");

        try{
            const response = await fetch(url_get_user+id,{
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
            const response = await fetch(url_send_message+chat.chat_id,{
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

    public async getChat(chatId : number){
        console.log("get chat");

        try{
            const response = await fetch(url_get_chat+chatId,{
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

}
