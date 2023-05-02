import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmedValidator } from 'src/app/providers/confirmed.validator';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit{

  form!: FormGroup;
  isRegistering = false;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['',  [Validators.required]],
      confirmPassword: ['',  [Validators.required]],
    }, {
      validator: ConfirmedValidator('password', 'confirmPassword')
    });
  }

  register() {
    this.isRegistering = true;
    setTimeout(() => {
      this.isRegistering = false;
    }, 5000);
  }

}
