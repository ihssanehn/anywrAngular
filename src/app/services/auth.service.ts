import { Injectable } from '@angular/core';
import { Observable, from, catchError, throwError } from 'rxjs';
import { translateFirebaseErrorMessage } from '../providers/shared.functions';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirebaseError, SignIn } from '../providers/typos';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: AngularFireAuth
  ) { }


  signIn(params: SignIn): Observable<any> {
    return from(this.auth.signInWithEmailAndPassword(
      params.email, params.password
    )).pipe(
      catchError((error: FirebaseError) => 
        throwError(() => new Error(translateFirebaseErrorMessage(error)))
      )
    );
  }
}
