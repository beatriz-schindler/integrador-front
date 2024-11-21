import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';

export const meuhttpInterceptor: HttpInterceptorFn = (request, next) => {

  let router = inject(Router);

  let token = localStorage.getItem('token');
  if (token && !router.url.includes('/login')) {
    request = request.clone({
      setHeaders: { Authorization: 'Bearer ' + token },
    });
  }

  return next(request).pipe(
    catchError((err: any) => {
      if (err instanceof HttpErrorResponse) {
	  
	  
        if (err.status === 401) {
          Swal.fire("Erro 401", "Você não está autorizado a acessar este conteúdo!", 'error');
          console.log(err);
          router.navigate(['admin/dashboard']);
        } else if (err.status === 403) {
          Swal.fire("Erro 403", err.message, 'error');
          console.log(err);
		  router.navigate(['/login']);
        } else {
          console.log(err);
        }
      } else {
        console.log(err);
      }
      return throwError(() => err);
    })
  );
};
