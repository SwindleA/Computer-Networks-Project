import { Routes } from '@angular/router';
import { ChatRoomComponent } from './chat-room/chat-room.component';
export const routes: Routes = [

  { path: 'chat_room/:id/:chatid', component: ChatRoomComponent},
];
