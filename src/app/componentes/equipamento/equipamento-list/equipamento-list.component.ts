import { Component, inject } from '@angular/core';
import { Equipamentos } from '../../../models/equipamentos';
import { EquipamentoService } from '../../../services/equipamento-service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoginService } from '../../../auth/login.service';

@Component({
  selector: 'app-equipamento-list',
  standalone: true,
  imports: [FormsModule, MdbFormsModule, NgxPaginationModule],
  templateUrl: './equipamento-list.component.html',
  styleUrl: './equipamento-list.component.scss'
})
export class EquipamentoListComponent {
  lista: Equipamentos[] = [];
  situacao: string = '';
  marca: string = '';
  modelo: string = '';
  patrimonio: string = '';

  // Variáveis de paginação
  currentPage: number = 1; // Página atual (começa em 1 para o usuário)
  pageSize: number = 10; // Itens por página
  totalItems: number = 0; // Total de itens
  totalPages: number = 0; // Total de páginas
  pageSizeOptions: number[] = [5, 10, 25, 50, 100, 250, 500];

  equipamentoService = inject(EquipamentoService);
  loginService = inject(LoginService);

  constructor() {
    this.loadPage();
  }

  loadPage() {
    // Ajuste apenas para a chamada da API
    const pageToSend = this.currentPage - 1;
    
    this.equipamentoService.findAllPage(pageToSend, this.pageSize).subscribe((data: any) => {
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


  filtrarCampos() {
    this.currentPage = 1; // Sempre voltar para a primeira página ao filtrar
    this.equipamentoService.findByFilter(this.situacao, this.patrimonio, this.modelo, this.marca).subscribe({
      next: (response: any) => {
        this.lista = response.content || response;
        this.totalItems = response.totalElements || response.length;
      },
      error: erro => {
        Swal.fire("Erro", erro.error, 'error');
      }
    });
  }

  limparCampos() {
    this.modelo = '';
    this.marca = '';
    this.patrimonio = '';
    this.situacao = '';
    this.currentPage = 1;
    this.loadPage();
  }

  findBySituacao(){
    this.equipamentoService.findBySituacao(this.situacao).subscribe({
      next: list => { //Equivalente ao TRy
          this.lista = list;
      },
      error: erro => { // Equivalente ao CATCH ou EXCEPTIONS
        Swal.fire("Erro", erro.error, 'error');
      }
    });
  }

  findByModelo(){
    this.equipamentoService.findByModelo(this.modelo).subscribe({
      next: list => { //Equivalente ao TRy
        this.lista = list;
    },
    error: erro => { // Equivalente ao CATCH ou EXCEPTIONS
      Swal.fire("Erro", erro.error, 'error');
    }
    });
  }

  findByMarca(){
    this.equipamentoService.findByMarca(this.marca).subscribe({
      next: list => { //Equivalente ao TRy
        this.lista = list;
    },
    error: erro => { // Equivalente ao CATCH ou EXCEPTIONS
      Swal.fire("Erro", erro.error, 'error');
    }
    });
  }

  findByPatrimonio(){
    this.equipamentoService.findByPatrimonio(this.patrimonio).subscribe({
      next: equipamento => { //Equivalente ao TRy
        this.lista = [equipamento];
    },
    error: erro => { // Equivalente ao CATCH ou EXCEPTIONS
      Swal.fire("Erro", erro.error, 'error');
    }
    });
  }
  
  desativar(patrimonio: string){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });
  
    // Mostra o alerta antes de deletar
    swalWithBootstrapButtons.fire({
      title: "Tem certeza que deseja desativar este equipamento?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Cancelar",
      reverseButtons: true
    }).then((result) => {
      // Se confirmado, chama o serviço de deleção
      if (result.isConfirmed) {
        this.equipamentoService.desativar(patrimonio).subscribe({
          next: mensagem => {
            console.log(mensagem);
            console.log(JSON.stringify(mensagem));
            swalWithBootstrapButtons.fire({
              title: "Pronto!",
              text: typeof mensagem === 'string' ? mensagem : JSON.stringify(mensagem), // Verifica se é string
              icon: "success"
            });
            this.loadPage(); // Atualiza a lista de equipamentos após a exclusão
          },
          error: erro => {
            Swal.fire("Erro", erro.error, 'error'); // Trata erros ao tentar excluir
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Mostra mensagem de cancelamento
        swalWithBootstrapButtons.fire({
          title: "Ação cancelada",
          text: "O equipamento não foi desativado.",
          icon: "warning"
        });
      }
    });
  }


}
