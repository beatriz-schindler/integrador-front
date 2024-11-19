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
  p: number = 1;

  equipamentoService = inject(EquipamentoService);

  loginService = inject(LoginService);

  constructor(){
    this.findAll();
  }

  findAll(){

    this.equipamentoService.findAll().subscribe({
        next: list => { //Equivalente ao TRy
            this.lista = list;
        },
        error: erro => { // Equivalente ao CATCH ou EXCEPTIONS
          Swal.fire("Erro", erro.error, 'error');
        }
    })
  }

  filtrar(){
    if(this.situacao){
      this.findBySituacao();
    }else{
      this.findAll();
    }
  }

  filtrarCampos(){
    this.equipamentoService.findByFilter(this.situacao, this.patrimonio, this.modelo, this.marca).subscribe({
      next: list => { //Equivalente ao TRy
          this.lista = list;
      },
      error: erro => { // Equivalente ao CATCH ou EXCEPTIONS
        Swal.fire("Erro", erro.error, 'error');
      }
    });
  }

  limparCampos() {
    this.modelo = '';
    this.marca = '';
    this.patrimonio = '';
    this.situacao = '';
    this.findAll();
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

  // findByEquipAtivo(){
  //   this.equipamentoService.findByEquipamentoAtivo().subscribe({
  //     next: list => { //Equivalente ao TRy
  //       this.lista = list;
  //   },
  //   error: erro => { // Equivalente ao CATCH ou EXCEPTIONS
  //     Swal.fire("Erro", erro.error, 'error');
  //   }
  //   });
  // }

  // findByEquipInativo(){
  //   this.equipamentoService.findByEquipamentoInativo().subscribe({
  //     next: list => { //Equivalente ao TRy
  //       this.lista = list;
  //   },
  //   error: erro => { // Equivalente ao CATCH ou EXCEPTIONS
  //     Swal.fire("Erro", erro.error, 'error');
  //   }
  //   });
  // }

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
            this.findAll(); // Atualiza a lista de equipamentos após a exclusão
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
