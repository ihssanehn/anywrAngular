import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './providers/auth.guard';


const routes: Routes = [
  {
    // Default path
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) // Lazy load account module
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadChildren:() => import('./pages/pages.module').then(m => m.PagesModule) // Lazy load pages module
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
