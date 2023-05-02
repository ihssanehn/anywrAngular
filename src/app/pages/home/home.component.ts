import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { combineLatest, merge } from 'rxjs';
import { User } from 'src/app/providers/typos';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  form!: FormGroup;
  currentUser : User | null = null;
  isUpdating = false;
  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.authService.currentUserObservable?.subscribe({
      next: (user) => {
        this.currentUser = user;
        this.fillProfileForm();
      },
      error: (error) => {
        this.snackBar.open(error.message, "OK", {
          duration: 5000
        })
        this.router.navigate(['auth', 'signin']);
      },
    });
  }
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: [, [Validators.required, Validators.email]],
      displayName: [],
    });
  }


  fillProfileForm() {
    this.form.patchValue({
      email: this.currentUser?.email,
      displayName: this.currentUser?.displayName,
    });
  }

  updateProfile() {
    if(this.form.value.email !== this.currentUser?.email) {
      this.updateEmail();
    }
    if(this.form.value.displayName !== this.currentUser?.displayName) {
      this.updateProfileData();
    }
  }

  updateProfileData() {
    this.isUpdating = true;
    this.authService.updateProfile({
      displayName: this.form.value.displayName,
    }).subscribe({
      next: () => {
        this.isUpdating = false;
        this.snackBar.open("Profile Updated Successfully", "😀", {
          duration: 5000
        })
      },
      error: (error) => {
        this.isUpdating = false;
        this.snackBar.open(error.message, "OK", {
          duration: 5000
        })
      }
    })
  }
  updateEmail() {
    this.isUpdating = true;
    this.authService.updateEmail(this.form.value.email).subscribe({
      next: () => {
        this.isUpdating = false;
        this.snackBar.open("Email Updated Successfully", "😀", {
          duration: 5000
        })
      },
      error: (error) => {
        this.isUpdating = false;
        this.snackBar.open(error.message, "OK", {
          duration: 5000
        })

        if(error.code === "auth/requires-recent-login") {
          this.logout(false);
        }
      }
    })
  }

  logout(withMessage = true) {
    this.authService.signOut().subscribe({
      next: () => {
        this.router.navigate(['auth', 'signin']);
        if(!withMessage) return;
        this.snackBar.open("Logged Out Successfully", "😀", {
          duration: 5000
        })
      },
      error: (error) => {
        this.snackBar.open(error.message, "OK", {
          duration: 5000
        })
      }
    })
  }
}
