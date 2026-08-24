import { isPlatformServer } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { REQUEST } from '@angular/ssr';

const INTERNAL_BFF_ORIGIN = 'http://bff:8080';
const SESSION_COOKIE = '__Host-tpi-session';

export const ssrApiInterceptor: HttpInterceptorFn = (request, next) => {
  if (!isPlatformServer(inject(PLATFORM_ID)) || !request.url.startsWith('/api/v1/')) {
    return next(request);
  }

  const sessionCookie = readSessionCookie(inject(REQUEST, { optional: true }));
  const headers = sessionCookie ? { Cookie: sessionCookie } : {};

  return next(request.clone({ url: `${INTERNAL_BFF_ORIGIN}${request.url}`, setHeaders: headers }));
};

function readSessionCookie(request: Request | null): string | null {
  const cookieHeader = request?.headers.get('cookie');
  if (!cookieHeader) {
    return null;
  }

  return cookieHeader
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${SESSION_COOKIE}=`)) ?? null;
}
