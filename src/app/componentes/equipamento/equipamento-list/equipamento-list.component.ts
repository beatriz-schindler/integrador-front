import { Component, inject } from '@angular/core';
import { Equipamentos } from '../../../models/equipamentos';
import { EquipamentoService } from '../../../services/equipamento-service';

@Component({
  selector: 'app-equipamento-list',
  standalone: true,
  imports: [],
  templateUrl: './equipamento-list.component.html',
  styleUrl: './equipamento-list.component.scss'
})
export class EquipamentoListComponent {

  lista: Equipamentos[] = [];

  equipamentoService = inject(EquipamentoService);

  constructor(){
    this.findAll();
  }

  findAll(){

    this.equipamentoService.findAll().subscribe({
        next: list => { //Equivalente ao TRy
            this.lista = list;
        },
        error: erro => { // Equivalente ao CATCH ou EXCEPTIONS
            alert("Deu erro!");
        }
    })
  }

}
