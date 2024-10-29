import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { Emprestimos } from '../../../models/emprestimos';
import { Alunos } from '../../../models/alunos';
import { Equipamentos } from '../../../models/equipamentos';
import { EmprestimoService } from '../../../services/emprestimo-service';
import { AlunoService } from '../../../services/aluno-service';
import { EquipamentoService } from '../../../services/equipamento-service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../services/usuario-service';
import { Login } from '../../../models/login';
import { Usuarios } from '../../../models/usuarios';
import { LoginComponent } from '../../../layout/login/login.component';
import { AutenticarService } from '../../../services/autenticar-service';

@Component({
  selector: 'app-emprestimo-form',
  standalone: true,
  imports: [MdbFormsModule, FormsModule],
  templateUrl: './emprestimo-form.component.html',
  styleUrl: './emprestimo-form.component.scss'
})
export class EmprestimoFormComponent {

  emprestimo: Emprestimos = new Emprestimos();
  aluno: Alunos = new Alunos();
  equipamento: Equipamentos = new Equipamentos();
  usuario!: Usuarios | null;
  emprestimoEncontrado: boolean = false;

  emprestimoService = inject(EmprestimoService);
  alunoService = inject(AlunoService);
  equipamentoService = inject(EquipamentoService);
  usuarioService = inject(UsuarioService);
  usuarioAutenticado = inject(AutenticarService);
  router = inject(Router);

  ngOnInit() {
    this.usuario = this.usuarioAutenticado.getUsuarioAutenticado();
    console.log("Usuário autenticado na rota do empréstimo:", this.usuario);

    if (this.usuario) {
      // Atribui o usuário autenticado ao empréstimo
      this.emprestimo.usuario = this.usuario;
      console.log("Usuário atribuído ao empréstimo:", this.emprestimo.usuario);
    } else {
      console.warn("Usuário não autenticado.");
    }
  }

  findAlunoByRa(){
    this.alunoService.findByRa(this.aluno.ra).subscribe({
      next: aluno => {
        if (aluno) {
          this.aluno = aluno;
        } else {
          this.resetAlunoFields(); // Limpa os campos caso o aluno não seja encontrado
          console.log("Aluno não encontrado");
        }
      },
      error: erro => {
        this.resetAlunoFields();
        Swal.fire("Erro", erro.error, 'error');
      }
    });
  }

  resetAlunoFields() {
    this.aluno = { ra: '', nome: '', curso: '', ativo: 0};
  }

  findEquipamentoByPatrimonio(){

    const patrimonio = this.equipamento.patrimonio;

    // Primeiro, verifica se o equipamento possui empréstimo em andamento
    this.emprestimoService.findByEquipamentoPorEmprestimoAtivo(patrimonio).subscribe(
        (emprestimo) => {
            if (emprestimo) {
              if (this.aluno.ra) { // Verifica se 'ra' já tem um valor válido
                Swal.fire("Erro", "O equipamento informado já está emprestado!", 'error');
                this.equipamento.patrimonio = ''; // Limpa o patrimônio se o equipamento já está emprestado
              } else {
                // Caso não haja erro, preenche os dados do empréstimo, aluno e equipamento
                this.emprestimo = emprestimo;
                this.aluno = emprestimo.aluno;
                this.equipamento = emprestimo.equipamento;
                this.emprestimoEncontrado = true;
              }
                 
            } else {
                // Se não houver empréstimo ativo, busque os dados do equipamento
                this.equipamentoService.findByPatrimonio(patrimonio).subscribe(
                    (equipamento) => {
                      if (equipamento) {
                        this.equipamento = equipamento;
                      } else {
                        this.resetEquipamentoFields(); // Limpa os campos caso o equipamento não seja encontrado
                        console.log("Equipamento não encontrado!");
                      }
                    },
                    (error) => {
                        Swal.fire("Erro", error.error, 'error');
                        this.resetEquipamentoFields();
                    }
                );
            }
        },
        (error) => {
            console.error("Erro ao verificar empréstimo", error);
            // Lidar com erro ao verificar empréstimo
        }
    );
  }

  resetEquipamentoFields() {
    this.equipamento = {
      id: 0,  // ou 0, dependendo do tipo de dado
      patrimonio: '',
      modelo: '',
      marca: '',
      dataAquisicao: '',
      observacao: '',
      situacao: '',
      ativo: 0 // ou true, dependendo da lógica do seu sistema
    };
  }

  iniciarEmprestimo(){
    this.emprestimo.aluno = this.aluno;
    this.emprestimo.equipamento = this.equipamento;


    console.log(this.emprestimo);

    this.emprestimoService.save(this.emprestimo).subscribe({
      next: mensagem => {
        Swal.fire({
          title: mensagem,
          icon: "success"
        }).then(() => {
          this.limparCampo();
          this.router.navigate(['admin/emprestimo/new']);
        });
      },
      error: erro => {
        Swal.fire('Erro', erro.error, 'error');
      }
    });
  }

  encerrarEmprestimo(){
    this.emprestimo.aluno = this.aluno;
    this.emprestimo.equipamento = this.equipamento;
    console.log(this.emprestimo.id);
    this.emprestimoService.encerrar(this.emprestimo.id, this.emprestimo).subscribe({
      next: mensagem => {
        Swal.fire({
          title: mensagem,
          icon: "success"
        }).then(() => {
          this.limparCampo();
          this.router.navigate(['admin/emprestimo/new']);
        });
      },
      error: erro => {
        Swal.fire('Erro', erro.error, 'error');
      }
    });
  }

  limparCampo(){
    this.aluno.ra = '';
    this.aluno.nome = '';
    this.aluno.curso = '';
    this.equipamento.patrimonio = '';
    this.equipamento.modelo = '';
    this.equipamento.marca = '';
    this.emprestimo.observacao = '';
  }

}
