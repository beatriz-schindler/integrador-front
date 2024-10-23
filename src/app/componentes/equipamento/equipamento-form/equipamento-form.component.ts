import { Component, inject } from '@angular/core';
import { Equipamentos } from '../../../models/equipamentos';
import { ActivatedRoute, Router } from '@angular/router';
import { EquipamentoService } from '../../../services/equipamento-service';
import Swal from 'sweetalert2'
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';

@Component({
  selector: 'app-equipamento-form',
  standalone: true,
  imports: [MdbFormsModule, FormsModule],
  templateUrl: './equipamento-form.component.html',
  styleUrl: './equipamento-form.component.scss'
})
export class EquipamentoFormComponent {

  tituloComponente: string = "Novo Equipamento";
  equipamento: Equipamentos = new Equipamentos();
  situacao: number =0;

  router = inject(Router);
  rotaAtivada = inject(ActivatedRoute);
  equipamentoService = inject(EquipamentoService);

  constructor(){
    let id = this.rotaAtivada.snapshot.params['id'];
    if(id > 0){ 
      this.tituloComponente = "Editar Equipamento"
      this.findById(id);
    }else {
      this.equipamento.id = 0; // Ou algo similar para indicar um novo eleitor
    }
  }

  findById(id: number){
    this.equipamentoService.findById(id).subscribe({
      next: equip => {
        this.equipamento = equip;
      },
      error: erro => {
        alert('Deu erro');
      }
    })

  }

  getSituacao(){
 
  }

  save(){

    this.equipamentoService.save(this.equipamento).subscribe({
      next: mensagem => {
        Swal.fire({
          title: mensagem,
          icon: "success"
        }).then(() => {
          this.router.navigate(['admin/equipamento']);
        });
      },
      error: erro => {
        alert('Deu erro');
      }
    });
  }

  update(){
    this.equipamentoService.update(this.equipamento).subscribe({
      next: mensagem => {
        Swal.fire({
          title: mensagem,
          icon: "success"
        }).then(() => {
          this.router.navigate(['admin/equipamento']);
        });
      },
      error: erro => {
        console.log(erro);
        Swal.fire('Erro', erro.error, 'error');
      }
    });
  }
}
