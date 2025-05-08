import { Component, inject } from '@angular/core';
import { Alunos } from '../../../models/alunos';
import { AlunoService } from '../../../services/aluno-service';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-aluno-list',
  standalone: true,
  imports: [FormsModule, MdbFormsModule],
  templateUrl: './aluno-list.component.html',
  styleUrl: './aluno-list.component.scss'
})
export class AlunoListComponent {

  lista: Alunos[] = [];

  // Variáveis de paginação
	currentPage: number = 1; // Página atual (começa em 1 para o usuário)
	pageSize: number = 10; // Itens por página
	totalItems: number = 0; // Total de itens
	totalPages: number = 0; // Total de páginas
	pageSizeOptions: number[] = [5, 10, 25, 50, 100, 250, 500];

	//Variáveis de Filtro
	ra: string = '';
	curso: string = '';
	nome: string = '';


  alunoService = inject(AlunoService);

  constructor() {
		this.loadPage();
	  }
	
	  loadPage() {
		// Ajuste apenas para a chamada da API
		const pageToSend = this.currentPage - 1;
		
		this.alunoService.findAllPage(pageToSend, this.pageSize).subscribe((data: any) => {
			this.lista = data.content;
			this.totalItems = data.totalElements;
			this.totalPages = data.totalPages || Math.ceil(this.totalItems / this.pageSize);
		});
	}
	
	  // Nos métodos de navegação, mantenha currentPage começando em 1
	  previousPage(): void {
		  if (this.currentPage > 1) { // Mude para 1 em vez de 0
			  this.currentPage--;
			  this.loadPage();
		  }
	  }
	
	  nextPage(): void {
		  if (this.currentPage < this.totalPages) { // Remova o -1
			  this.currentPage++;
			  this.loadPage();
		  }
	  }
	
	  onPageSizeChange() {
		this.currentPage = 1; // Reset para a primeira página quando mudar o tamanho
		this.loadPage();
	  }
	
	  onPageChange(page: number) {
		this.currentPage = page;
		this.loadPage();
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

 filtrarCampos() {
		this.alunoService.findByFilter(
			this.ra, this.nome, this.curso).subscribe({
			next: (list: Alunos[]) => {
				this.lista = list;
				this.currentPage = 1; // Reinicia a paginação
				this.totalPages = 1; // Garante que tudo será exibido em uma única página
			},
			error: (erro) => {
				console.log(erro);
				Swal.fire("Erro", erro.error, 'error');
			}
		});
	}

	limparCampos(){
		this.ra = '';
		this.nome = '';
		this.curso = '';
		this.currentPage = 1;
		this.pageSize = 10;
   		this.loadPage();
	}
}
