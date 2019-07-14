import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';

@Injectable({
  providedIn: 'root'
})
export class TranslationFileLoadedGuard implements CanActivate  {
  constructor(public store: Store, public router: Router) {}
  canActivate(): boolean {
    if(!this.store.snapshot().translations.inputXml) {
      this.router.navigate(['']);
      return false;
    }
    return true;
  }
}
