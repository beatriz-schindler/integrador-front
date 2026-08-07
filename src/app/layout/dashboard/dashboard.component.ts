import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';

import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';

import { Emprestimos } from '../../models/emprestimos';
import { EmprestimoService } from '../../services/emprestimo-service';


interface ChartData {
  name: string;
  value: number;
}


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgxChartsModule,
    MdbFormsModule,
    DatePipe
  ],
  providers: [DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  lista: Emprestimos[] = [];

  emprestimosPorPatrimonio: ChartData[] = [];
  emprestimosPorCurso: ChartData[] = [];
  emprestimosPorAluno: ChartData[] = [];
  emprestimosPorDia: ChartData[] = [];

  periodoSelecionado = 7;

  datePipe = inject(DatePipe);

  emprestimoService = inject(EmprestimoService);


  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [
      '#00E88F',
      '#fb7b01',
      '#276a7e',
      '#1e1e24',
      '#e60058',
      '#9467bd',
      '#72b79f',
      '#f9d1dc',
      '#7f7f7f',
      '#fed500'
    ]
  };


  constructor() {
    this.findAll();
  }


  findAll() {

    this.emprestimoService.findAll().subscribe({

      next: (list) => {

        this.lista = list;

        this.processarEmprestimosPorPatrimonio();
        this.processarEmprestimosPorCurso();
        this.processarEmprestimosPorDia();

      },

      error: (erro) => {
        Swal.fire(
          'Erro',
          erro.error,
          'error'
        );
      }

    });

  }


  onPeriodoChange(event: Event) {

    const selectElement = event.target as HTMLSelectElement;

    this.periodoSelecionado = Number(selectElement.value);

    this.processarEmprestimosPorDia();

  }



  processarEmprestimosPorPatrimonio() {


    const equipamentoCountMap = new Map<string, number>();


    this.lista.forEach((emprestimo) => {

      const patrimonio = emprestimo.equipamento.patrimonio;

      equipamentoCountMap.set(
        patrimonio,
        (equipamentoCountMap.get(patrimonio) || 0) + 1
      );

    });


    this.emprestimosPorPatrimonio =
      Array.from(
        equipamentoCountMap,
        ([name, value]) => ({
          name,
          value
        })
      )
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

  }



  processarEmprestimosPorCurso() {


    const cursoCountMap = new Map<string, number>();


    this.lista.forEach((emprestimo) => {

      const curso = emprestimo.aluno.curso;

      cursoCountMap.set(
        curso,
        (cursoCountMap.get(curso) || 0) + 1
      );

    });


    this.emprestimosPorCurso =
      Array.from(
        cursoCountMap,
        ([name, value]) => ({
          name,
          value
        })
      )
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

  }




  processarEmprestimosPorDia() {


    const hoje = new Date();

    const diasAtras = new Date();

    diasAtras.setDate(
      hoje.getDate() - this.periodoSelecionado
    );


    const diaCountMap = new Map<string, number>();


    this.lista.forEach((emprestimo) => {


      const dataEmprestimo = new Date(
        emprestimo.dataRetirada
      );


      if (
        dataEmprestimo >= diasAtras &&
        dataEmprestimo <= hoje
      ) {


        const dataFormatada =
          this.datePipe.transform(
            emprestimo.dataRetirada,
            'dd-MM-yyyy'
          );


        if (dataFormatada) {

          diaCountMap.set(
            dataFormatada,
            (diaCountMap.get(dataFormatada) || 0) + 1
          );

        }

      }

    });


    this.emprestimosPorDia =
      Array.from(
        diaCountMap,
        ([name, value]) => ({
          name,
          value
        })
      )
      .sort(
        (a, b) =>
          new Date(a.name).getTime() -
          new Date(b.name).getTime()
      );

  }

}