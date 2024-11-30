import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from './DataStructures/message';
import { Chat } from './DataStructures/chat';
import { User } from './DataStructures/user';

const url_get_user = "https://localhost:7244/api/Home/GetUser?id="
const url_get_all_users = "https://localhost:7244/api/Home/GetAllUsers"
const url_send_message = "https://localhost:7244/api/Home/SendMessage?chat_id="
const url_get_chat = "https://localhost:7244/api/Home/GetChat?id="
const url_create_chat = "https://localhost:7244/api/Home/CreateChat?id="
const url_get_chats = "https://localhost:7244/api/Home/GetChats?id="
const url_login_create_user = "https://localhost:7244/api/Home/Login_CreateUser?user_name="
const url_update_users ="https://localhost:7244/api/Home/UpdateUsersInChat?chat_id="

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

    async getAllUsers(){
        console.log("GetAllUsers");

        try{
            const response = await fetch(url_get_all_users,{
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

    public async createChat(chat : Chat, userId : number){
        

        var pack : string = JSON.stringify(chat)

        console.log(pack)
        try{
            const response = await fetch(url_create_chat+userId,{
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

    // public async getChats(user_id : string){
    //     console.log("Get chats");

    //     try{
    //         const response = await fetch(url_get_chats+user_id,{
    //             headers : new Headers({'content-type' :'application/json'}),
    //             mode : 'cors'
    //         });

    //         const data = await response.json()
    //         console.log(data) 
    //         return data;
    //     }catch(error){
    //         console.log(error);
    //     }

    // }

    //send the user's name to the api to see if it exists, if so, route the user to the home page. If not, create the user and then route to create chat page
    public async login_createUser(user_name : string){
        console.log("login/create user");
        var pack : string = JSON.stringify(user_name)
        try{
            const response = await fetch(url_login_create_user,{                
                method : 'POST',
                headers : new Headers({'content-type' :'application/json'}),
                mode : 'cors',
                body : pack
            });

            const data = await response.json()
            console.log(data) 
            return data;
        }catch(error){
            console.log(error);
        }

    }

    public async updateUsersInChat(chat_id : number, users : User[]){
        

        var pack : string = JSON.stringify(users)

        console.log(pack)
        try{
            const response = await fetch(url_update_users+chat_id,{
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

}
