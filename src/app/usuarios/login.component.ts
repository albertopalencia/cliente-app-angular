import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import swal from 'sweetalert2';
import { AuthService } from "./auth.service";
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  titulo: string = 'Please Sign in!';
  usuario: Usuario

  constructor(private authService: AuthService, private router: Router) {
    this.usuario = new Usuario();
  }

  ngOnInit() {
    if (this.authService.autenticado()) {
      swal('Login', `Hola ${this.authService.usuario.username} ya estas autenticado!`, 'info');
      this.router.navigate(['/clientes']);
    }
   }

  login(): void {

    if (this.usuario.username == null || this.usuario.password == null) {
      swal('Error', 'username o password incorrecto')
      return;
    }

    this.authService.login(this.usuario).subscribe(response => {      

      this.authService.guardarUsuario(response.access_token);
      this.authService.guardarToken(response.access_token);
      let usuario = this.authService.usuario;
      this.router.navigate(['/clientes']);
      swal('Login', `Hola ${usuario.username}, has iniciado sesión con éxito!`, 'success');
    },
    error=> {
      if (error.status == 400) {
        swal('Login', `Usuario o clave incorrectas!`, 'error');
        return;
      }
    })
  }

}
