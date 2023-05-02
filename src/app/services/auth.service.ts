import { Injectable } from '@angular/core';
import {
  Observable,
  from,
  catchError,
  throwError,
  first,
  map,
  switchMap,
} from 'rxjs';
import { translateFirebaseErrorMessage } from '../providers/shared.functions';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirebaseError, SignIn } from '../providers/typos';
import jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenName = 'anywr_token';

  constructor(private auth: AngularFireAuth) {}

  signIn(params: SignIn): Observable<any> {
    return from(
      this.auth.signInWithEmailAndPassword(params.email, params.password)
    ).pipe(
      first(),
      // using switch map to get user token
      switchMap((data) => {
        if(!data.user) return throwError(() => new Error('User not found'));
        return from(data.user!.getIdToken()).pipe(
          first(),
          map((token) => {
            this.setToken(token);
            return data;
          })
        );
      }),
      catchError((error: FirebaseError) =>
        throwError(() => new Error(translateFirebaseErrorMessage(error)))
      )
    );
  }

  signUp(params: SignIn): Observable<any> {
    return from(
      this.auth.createUserWithEmailAndPassword(params.email, params.password)
    ).pipe(
      first(),
      map((data) => {
        console.log('data', data);
      }),
      catchError((error: FirebaseError) =>
        throwError(() => new Error(translateFirebaseErrorMessage(error)))
      )
    );
  }

  async isLoggedIn() {
    const token = this.getToken();

    if (!token) {
      return false;
    }
    const decodeToken : any = jwt_decode(token);
    // get exp time and check if token is expired
    const expTime = decodeToken?.exp * 1000;
    const now = new Date().getTime();
    return now < expTime;
  }

  getToken() {
    return localStorage.getItem(this.tokenName);
  }

  setToken(token: string) {
    localStorage.setItem(this.tokenName, token);
  }

  deleteToken() {
    localStorage.removeItem(this.tokenName);
  }
}
