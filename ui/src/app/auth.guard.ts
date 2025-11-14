import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const baseUrl = `${window.location.origin}${window.location.pathname.replace(/\/[^\/]*$/, '/')}`;
    const checkAuthUrl = `${baseUrl}version`;

    return this.http.get(checkAuthUrl).pipe(
      map(response => {
        // 如果能成功获取版本信息，说明已认证
        return true;
      }),
      catchError((error) => {
        // 如果是401错误，说明未认证，重定向到登录页
        if (error.status === 401) {
          this.router.navigate(['/login']);
          return of(false);
        }
        // 对于其他错误（如网络问题），仍然允许访问（可能是后端问题）
        // 但在生产环境中，您可能希望更严格地处理这些情况
        return of(true);
      })
    );
  }
}