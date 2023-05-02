import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit{

  form!: FormGroup;
  isLoggingIn = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }
  
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['a@a.com', [Validators.required, Validators.email]],
      password: ['123456', [Validators.required]]
    });
  }


  login() {
    this.isLoggingIn = true;


    this.authService.signIn({
      email: this.form.value.email,
      password: this.form.value.password
    }).subscribe({
      next: () => this.router.navigate(['home']),
      error: error  => {
        this.isLoggingIn = false
        this.snackBar.open(error.message, "Some Error", {
          duration: 5000
        })
      }
    });
  }



}
