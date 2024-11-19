import { Routes } from '@angular/router';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { CreateNewChatComponent } from './create-new-chat/create-new-chat.component';
import { HomeComponent } from './home/home.component';
export const routes: Routes = [
  
  { path: ':id', component: HomeComponent},
  { path: ':id/chat_room/:chatid', component: ChatRoomComponent},
  {path: ':id/create_chat', component : CreateNewChatComponent}
];
