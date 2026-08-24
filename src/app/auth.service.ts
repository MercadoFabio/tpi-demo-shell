import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { catchError, map, of, tap, throwError } from 'rxjs';

export interface SessionResponse {
  readonly authenticated: boolean;
  readonly email: string | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly document = inject(DOCUMENT);
  private readonly http = inject(HttpClient);
  readonly session = signal<SessionResponse | null>(null);

  constructor() {
    this.refreshSession().subscribe();
  }

  login(email: string, password: string) {
    return this.http.post<SessionResponse>('/api/v1/auth/login', { email, password }).pipe(
      tap((session) => this.session.set(session)),
      catchError(() => throwError(() => new Error('No fue posible iniciar sesión. Verificá tus credenciales.'))),
    );
  }

  logout() {
    const csrfToken = this.readCsrfToken();
    return this.http.post<void>('/api/v1/auth/logout', undefined, {
      headers: csrfToken ? new HttpHeaders({ 'X-CSRF-Token': csrfToken }) : undefined,
    }).pipe(tap(() => this.session.set(null)));
  }

  refreshSession() {
    return this.http.get<SessionResponse>('/api/v1/auth/session').pipe(
      map((session) => session.authenticated ? session : null),
      tap((session) => this.session.set(session)),
      catchError(() => {
        this.session.set(null);
        return of(null);
      }),
    );
  }

  private readCsrfToken(): string | null {
    return this.document.cookie
      .split(';')
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith('__Host-tpi-csrf='))
      ?.split('=')[1] ?? null;
  }
}
