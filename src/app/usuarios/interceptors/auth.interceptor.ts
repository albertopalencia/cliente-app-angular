import { Router } from '@angular/router';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from '../auth.service';

import { Observable, throwError } from 'rxjs';
import {  catchError } from 'rxjs/operators';
import swal from 'sweetalert2';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService, private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
       
        return next.handle(req).pipe(
        catchError(e=> {

            if (e.status == 401) {
                
                if (this.authService.autenticado()) {
                    if(e.error.error == "invalid_token") {
                        swal('', `Hola ${this.authService.usuario.username} su sessión ha expirado`, 'warning');
                    }                   
                    this.authService.logout();
                }

                this.router.navigate(['/login']);               
            }
          
            if (e.status == 403) {
                swal('Acceso denegado', `Hola ${this.authService.usuario.username} no tienes acceso a este recurso`, 'warning');
                this.router.navigate(['/clientes']);               
            }
            return throwError(e);
        })
            
        );
    }
}
