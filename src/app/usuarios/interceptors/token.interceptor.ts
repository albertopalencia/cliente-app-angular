import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from '../auth.service';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(private authServices: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let token = this.authServices.token;
        if(token != null) {
            const authReq = req.clone({ 
                headers: req.headers.set('Authorization', 'Bearer ' + token)
            });
            
            return next.handle(authReq);
        }
        
        return next.handle(req);
    }
}
