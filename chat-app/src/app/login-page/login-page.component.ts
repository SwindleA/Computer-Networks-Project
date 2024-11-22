import { Component } from '@angular/core';
import {FormBuilder, FormArray, FormGroup,FormsModule,FormControl,ReactiveFormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { ApiService } from '../api.service';
import { User } from '../DataStructures/user';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,MatIconModule,MatButtonModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {


    loginForm: FormGroup = new FormGroup({
        name : new FormControl(''),
    });
    constructor(private api : ApiService,private router : Router){}
    
    async loginUser(){
        var newUser : User = await this.api.login_createUser( this.loginForm.value.name);
        window.location.href = '/user/'+newUser.id;
    }
}
