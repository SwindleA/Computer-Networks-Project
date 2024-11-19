import { Component,Injectable } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { ApiService } from './api.service';
import { ActivatedRoute,Router } from '@angular/router';
import { ChatListComponent } from './chat-list/chat-list.component';
import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule, MatIconModule, ChatListComponent,MatToolbarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Web Chat Application';

  user_id : number = -1;
    
  constructor(private router : Router)
   { 
    console.log(window.location.pathname.split("/")[1])
    this.user_id = Number.parseInt(window.location.pathname.split("/")[1])
  }

  createNewChat(){ 
   
    this.router.navigate(['/'+this.user_id+'/create_chat'])
  }


}
