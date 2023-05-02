import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ConfirmedValidator } from 'src/app/providers/confirmed.validator';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  isRegistering = false;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validator: ConfirmedValidator('password', 'confirmPassword'),
      }
    );
  }

  register() {
    this.isRegistering = true;
    this.authService
      .signUp({
        email: this.form.value.email,
        password: this.form.value.password,
      })
      .subscribe({
        next: () => {
          this.router.navigate(['home']);
          this.snackBar.open('Welcome', '😀', {
            duration: 5000,
          });
        },
        error: (error) => {
          this.isRegistering = false;
          this.snackBar.open(error.message, 'OK', {
            duration: 5000,
          });
        },
      });
  }
}
