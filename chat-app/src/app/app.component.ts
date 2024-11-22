import { Component,Injectable } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { ApiService } from './api.service';
import { ActivatedRoute,Router } from '@angular/router';
import { ChatListComponent } from './chat-list/chat-list.component';
import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule, MatIconModule, ChatListComponent,MatToolbarModule,NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Web Chat Application';

  user_id : number = -1;

  show_login : boolean = false;
  show_header_buttons : boolean = false;
    
  constructor(private router : Router)
   { 
    
  }

  ngOnInit(){
    console.log(window.location.pathname.split("/")[2])
    this.user_id = Number.parseInt(window.location.pathname.split("/")[2])
    if( Number.isNaN( this.user_id)){
        if(window.location.pathname.split("/")[1] != "login"){
            console.log("here")
            this.show_login = true;
        }
        this.show_header_buttons = false;

        
    }else{
        this.show_header_buttons = true;
    }
  }

  createNewChat(){ 
   
    this.router.navigate(['/user/'+this.user_id+'/create_chat'])
  }



}
