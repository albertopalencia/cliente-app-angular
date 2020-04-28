import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from './usuario';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  

  private _usuario: Usuario;
  private _token: string;

  constructor(private http: HttpClient) { }

  public get usuario(): Usuario{
    
    if (this._usuario != null) {
      return this._usuario;
    }
    else if(this._usuario == null && sessionStorage.getItem('usuario') != null) {
      this._usuario =  JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
      return this._usuario;
    }

    return new Usuario();
  }

  public get token(): string{

    if (this._token != null) {
      return this._token;
    }
    else if(this._token == null && sessionStorage.getItem('token') != null) {
        return sessionStorage.getItem('token');
    }
    return null;
  }


  guardarToken(access_token: string): void {

    let payload = this.obtenerDatosToken(access_token);
    this._usuario = new Usuario();
    this._usuario.nombre = payload.nombre;
    this._usuario.apellido = payload.apellido;
    this._usuario.email = payload.email;
    this._usuario.username = payload.user_name;
    this._usuario.roles = payload.authorities;
    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
  }

  guardarUsuario(access_token: string): void  {
    this._token = access_token;
    sessionStorage.setItem('token', access_token);
  }

  autenticado(): boolean {
    let payload = this.obtenerDatosToken(this.token);    
    if (payload != null && payload.user_name && payload.user_name.length > 0) {
      return true;  
    }
    return false;
  }

  tieneRole(role: string): boolean {
    if(this.usuario.roles.includes(role)){
      return true;
    }
    return false;
  }

  login(usuario: Usuario): Observable<any> {

    const urlEndPoint = environment.urlService + 'oauth/token';
    const credenciales = btoa('angularapp'+ ':' + '12345');
    const httpHeaders = new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + credenciales,
        });

      let params = new URLSearchParams();      
      params.set('username', usuario.username);
      params.set('password', usuario.password);
      params.set('grant_type', 'password');

    return this.http.post(urlEndPoint, params.toString(), { headers: httpHeaders });
  }

  logout(): void {
   this._usuario = null;
   this._token = null;
   sessionStorage.clear();
   sessionStorage.removeItem('token');
   sessionStorage.removeItem('usuario');
  }

  obtenerDatosToken(accessToken: string): any {
    if (accessToken != null) {
      return JSON.parse(atob(accessToken.split('.')[1]));
    }
    return null;
  }

}
