import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { Emprestimos } from '../../../models/emprestimos';
import { EmprestimoService } from '../../../services/emprestimo-service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-emprestimo-list',
  standalone: true,
  imports: [FormsModule, MdbFormsModule, DatePipe],
  templateUrl: './emprestimo-list.component.html',
  styleUrl: './emprestimo-list.component.scss'
})
export class EmprestimoListComponent {

  lista: Emprestimos[] = [];
  emprestimo!: Emprestimos;

  emprestimoService = inject(EmprestimoService);

  constructor(){
    this.findAll();
  }

  findAll(){

    this.emprestimoService.findAll().subscribe({
        next: list => { //Equivalente ao TRy
            this.lista = list;
        },
        error: erro => { // Equivalente ao CATCH ou EXCEPTIONS
          Swal.fire("Erro", erro.error, 'error');
        }
    })
  }


}
