import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/_Services/user.service';

@Injectable({
  providedIn: 'root'
})
@Injectable()
export class ApiInterceptorService implements HttpInterceptor {

  constructor(private userservice:UserService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.userservice.GetToken()}`
      }
    });

    return next.handle(request);
  }
}

