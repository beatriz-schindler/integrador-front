import { Component, inject } from '@angular/core';
import { Alunos } from '../../../models/alunos';
import { AlunoService } from '../../../services/aluno-service';

@Component({
  selector: 'app-aluno-list',
  standalone: true,
  imports: [],
  templateUrl: './aluno-list.component.html',
  styleUrl: './aluno-list.component.scss'
})
export class AlunoListComponent {

  lista: Alunos[] = [];

  alunoService = inject(AlunoService);

  constructor(){
    this.findAll();
  }

  findAll(){

    this.alunoService.findAll().subscribe({
        next: list => { //Equivalente ao TRy
            this.lista = list;
        },
        error: erro => { // Equivalente ao CATCH ou EXCEPTIONS
            alert("Deu erro!");
        }
    })

 }
}
