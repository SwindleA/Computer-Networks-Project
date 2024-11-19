import { User } from "./user";
import { Message } from "./message";
export interface Chat {
    chat_id : number, chat_name : string,users_in_chat : User[], messages : Message[]
}