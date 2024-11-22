import { Routes } from '@angular/router';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { CreateNewChatComponent } from './create-new-chat/create-new-chat.component';
import { HomeComponent } from './home/home.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AppComponent } from './app.component';
export const routes: Routes = [

  { path: 'user/:id', component: HomeComponent},
  { path: 'user/:id/chat_room/:chatid', component: ChatRoomComponent},
  {path: 'user/:id/create_chat', component : CreateNewChatComponent},
  {path: '', component : LoginPageComponent}
];
