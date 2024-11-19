import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormBuilder, FormArray, FormGroup,FormsModule,FormControl,ReactiveFormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { Chat } from '../DataStructures/chat';
import { User } from '../DataStructures/user';
import { ApiService } from '../api.service';
import { ActivatedRoute,Router } from '@angular/router';

@Component({
  selector: 'app-create-new-chat',
  standalone: true,
  imports: [MatInputModule,MatFormFieldModule,FormsModule,MatIconModule,MatButtonModule,ReactiveFormsModule,NgFor],
  templateUrl: './create-new-chat.component.html',
  styleUrl: './create-new-chat.component.css'
})
export class CreateNewChatComponent {

    users : User[] = [];
    userID : number = -1;
    checkboxForm: FormGroup = new FormGroup({});

    constructor(private api : ApiService,private formbuilder: FormBuilder,private route: ActivatedRoute,private router : Router){}

    async ngOnInit(){
        
        this.userID = Number.parseInt(this.route.snapshot.paramMap.get('id')??"0");

        //get list of users
        this.users = await this.api.getAllUsers();

        //display users in checkbox list

        this.checkboxForm = this.formbuilder.group({
            checkboxes: this.formbuilder.array(
                this.users.map(
                    (item, index) => {
                        if(item.id == this.userID){
                            return true;
                        }else{
                            return false;
                        }
                    },
                )), // Creates a FormArray of booleans,
            name : new FormControl(''),
          });

        console.log(this.checkboxForm)

    }

    async createChat(){

        const selectedOptions = this.checkboxForm.value.checkboxes
      .map((checked: boolean, i: number) => checked ? this.users[i]: null)
      .filter((v: string | null) => v !== null);
      console.log("Selected Options:", selectedOptions);

        var newChat : Chat = {
                                chat_id : 0,
                                chat_name :  this.checkboxForm.value.name,
                                users_in_chat : selectedOptions,
                                messages : []};

   
        var chat  : Chat = await this.api.createChat(newChat,this.userID);

        var tempID = Number.parseInt(this.route.snapshot.paramMap.get('id')??"0");
        this.router.navigate(['/'+tempID+'/chat_room/'+chat.chat_id])

    }

}
