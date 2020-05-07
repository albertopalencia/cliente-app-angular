import { Cliente } from './../../clientes/cliente';
import { ItemFactura } from "./item-factura";


export class Factura {
    id:          number;
    descripcion: string;
    observacion: string;
    createAt:    string;
    items:       ItemFactura[] = [];
    cliente:     Cliente;
    total:       number;


    calcularGranTotal(): number {
        this.total = 0;
        this.items.forEach( (item: ItemFactura) => {
          this.total += item.calcularImporte();
        });
        return this.total;
    }
}
