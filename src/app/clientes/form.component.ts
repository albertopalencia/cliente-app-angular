import { Region } from './region';
import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  public cliente: Cliente = new Cliente();

  regiones: Region[];

  titulo: string = "Crear Cliente";

  errores: string[];

  constructor(private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      let id = +params.get('id');
      if (id) {
        this.clienteService.getCliente(id).subscribe((cliente) => this.cliente = cliente);
        this.titulo = 'Editar Cliente';
      }
    });

    this.clienteService.getRegiones().subscribe(regiones => { this.regiones = regiones; });
  }

  create(): void {
    this.clienteService.create(this.cliente)
      .subscribe(
        cliente => {
          this.router.navigate(['/clientes']);
          swal('Nuevo cliente', `El cliente ${cliente.nombre} ha sido creado con éxito`, 'success');
        },
        err => {
          this.errores = err.error.errors as string[];
          console.error(err.error.errors);
        }
      );

      this.titulo = 'Crear Cliente';
  }

  update(): void {
    this.clienteService.update(this.cliente)
      .subscribe(
        json => {
          this.router.navigate(['/clientes']);
          swal('Cliente Actualizado', `${json.mensaje}: ${json.cliente.nombre}`, 'success');
        },
        err => {
          this.errores = err.error.errors as string[];
          console.error(err.error.errors);
        }
      )
  }

  regresar():void {
 this.router.navigate(['/clientes']);
  }


  compararRegion(regionCliente: Region, regionAsignado: Region) {
    return (regionCliente === null || regionCliente === undefined) || (regionAsignado === null || regionAsignado === undefined) ? false :
      regionCliente.id === regionAsignado.id;
  }

}
