import { User } from "./user";
import { Message } from "./message";
export interface Chat {
    chat_id : number, users_in_chat : User[], messages : Message[]
}