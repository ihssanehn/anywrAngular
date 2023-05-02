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
  userData: any;

  constructor(private auth: AngularFireAuth) {
    this.auth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
      } else {
        localStorage.removeItem('user')
      }
    });
  }

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

  updateProfile(params: any): Observable<any> {
    return from(this.auth.currentUser).pipe(
      first(),
      switchMap((user) => {
        if (!user) {
          return throwError(() => new Error('User not found'));
        }else{
          return from(user.updateProfile(params)).pipe(first());
        }
      }),
      catchError((error: FirebaseError) =>
        throwError(() => error))
    );
  }

  updateEmail(email: string): Observable<any> {
    return from(this.auth.currentUser).pipe(
      first(),
      switchMap((user) => {
        if (!user) {
          return throwError(() => new Error('User not found'));
        }else{
          return from(user.updateEmail(email)).pipe(first());
        }
      }),
      catchError((error: FirebaseError) =>
      throwError(() => error))
    );
  }
  get currentUserObservable(): Observable<any> {
    return this.auth.authState.pipe(first());
  }
  get isLoggedIn() : boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    const decodeToken : any = jwt_decode(token);
    const expTime = decodeToken?.exp * 1000;
    const now = new Date().getTime();
    return now < expTime;
  }

  signOut() {
    this.deleteToken();
    return from(this.auth.signOut()).pipe(first());
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
