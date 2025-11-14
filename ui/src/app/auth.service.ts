import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * 检查用户是否已认证
   * 通过向后端发送一个简单的请求来验证会话
   */
  checkAuth(): Observable<boolean> {
    const baseUrl = `${window.location.origin}${window.location.pathname.replace(/\/[^\/]*$/, '/')}`;
    const checkAuthUrl = `${baseUrl}version`;

    return this.http.get(checkAuthUrl).pipe(
      map(response => {
        this.isAuthenticated = true;
        return true;
      }),
      catchError((error: HttpErrorResponse) => {
        // 如果是401错误，说明未认证
        if (error.status === 401) {
          this.isAuthenticated = false;
          return of(false);
        }
        // 对于其他错误（如网络问题），我们假设用户仍然认证
        return of(true);
      })
    );
  }

  /**
   * 获取当前认证状态
   */
  getAuthStatus(): boolean {
    return this.isAuthenticated;
  }

  /**
   * 注销用户
   */
  logout(): void {
    // 清除认证状态
    this.isAuthenticated = false;

    // 调用后端注销API并重定向到登录页
    const baseUrl = `${window.location.origin}${window.location.pathname.replace(/\/[^\/]*$/, '/')}`;
    const logoutUrl = `${baseUrl}logout`;

    // 直接跳转到注销URL，让后端处理注销并重定向到登录页
    window.location.href = logoutUrl;
  }
}