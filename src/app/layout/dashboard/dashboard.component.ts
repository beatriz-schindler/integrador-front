import { Component, inject } from '@angular/core';
import { Emprestimos } from '../../models/emprestimos';
import Swal from 'sweetalert2';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Color, ScaleType } from '@swimlane/ngx-charts'; // Importar Color e ScaleType
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { DatePipe } from '@angular/common';
import { EmprestimoService } from '../../services/emprestimo-service';

@Component({
	selector: 'app-dashboard',
	standalone: true,
	imports: [NgxChartsModule, MdbFormsModule, DatePipe],
	providers: [DatePipe],
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {

	lista: Emprestimos[] = [];
	emprestimosPorPatrimonio: any[] = [];
	emprestimosPorCurso: any[] = []; // Adicione esta linha
	emprestimosPorAluno: any[] = []; // Adicione esta linha
	emprestimosPorDia: any[] = []; // Adicione esta linha

	periodoSelecionado: number = 7; // Período padrão (30 dias)

	datePipe = inject(DatePipe);

	// Adicione este método ao seu componente
	onPeriodoChange(event: Event) {
		const selectElement = event.target as HTMLSelectElement;
		this.periodoSelecionado = Number(selectElement.value);
		this.processarEmprestimosPorDia(); // Atualiza os dados do gráfico quando o período muda
	}

	colorScheme: Color = {
		name: 'custom',
		selectable: true,
		group: ScaleType.Ordinal,
		domain: [
			'#00E88F', // Verde Neon
			'#fb7b01', // Laranja Escuro
			'#276a7e', // Azul Escuro
			'#1e1e24', // Cinza Escuro
			'#e60058', // Vermelho 
			'#9467bd', // Roxo Lavanda
			'#72b79f', // Verde cor de burro quando foge
			'#f9d1dc', // Rosa Pastel
			'#7f7f7f', // Cinza Médio
			'#fed500', // Amarelo Normal
		],
	};

	emprestimoService = inject(EmprestimoService);

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
				Swal.fire('Erro', erro.error, 'error');
			},
		});
	}

	processarEmprestimosPorPatrimonio() {
		// Contagem de empréstimos por patrimônio do equipamento
		const equipamentoCountMap = new Map<string, number>();

		this.lista.forEach((emprestimo) => {
			const patrimonio = emprestimo.equipamento.patrimonio;
			equipamentoCountMap.set(patrimonio, (equipamentoCountMap.get(patrimonio) || 0) + 1);
		});

		// Convertendo o Map para o formato necessário pelo ngx-charts e ordenando
		this.emprestimosPorPatrimonio = Array.from(equipamentoCountMap, ([name, value]) => ({ name, value }))
			.sort((a, b) => b.value - a.value) // Ordena em ordem decrescente pelo valor
			.slice(0, 5); // Limita aos 10 primeiros
	}

	processarEmprestimosPorCurso() {
		// Contagem de empréstimos por curso
		const cursoCountMap = new Map<string, number>();

		this.lista.forEach((emprestimo) => {
			const curso = emprestimo.aluno.curso;
			cursoCountMap.set(curso, (cursoCountMap.get(curso) || 0) + 1);
		});

		// Convertendo o Map para o formato necessário pelo ngx-charts e ordenando
		this.emprestimosPorCurso = Array.from(cursoCountMap, ([name, value]) => ({ name, value }))
			.sort((a, b) => b.value - a.value) // Ordena em ordem decrescente pelo valor
			.slice(0, 5); // Limita aos 10 cursos mais utilizados
	}

	// Atualize o método processarEmprestimosPorDia
	processarEmprestimosPorDia() {
		const hoje = new Date();
		const diasAtras = new Date();
		diasAtras.setDate(hoje.getDate() - this.periodoSelecionado); // Use o período selecionado

		const diaCountMap = new Map<string, number>();

		this.lista.forEach((emprestimo) => {
			const dataEmprestimo = new Date(emprestimo.dataRetirada);
			if (dataEmprestimo >= diasAtras && dataEmprestimo <= hoje) {
				let dataFormatada = '';
				let dataFormatadaNova = this.datePipe.transform(emprestimo.dataRetirada, 'dd-MM-yyyy');
				if(dataFormatadaNova)
					dataFormatada = dataFormatadaNova;
				diaCountMap.set(dataFormatada, (diaCountMap.get(dataFormatada) || 0) + 1);
			}
		});

		this.emprestimosPorDia = Array.from(diaCountMap, ([name, value]) => ({ name, value })).sort(
			(a, b) => new Date(a.name).getTime() - new Date(b.name).getTime()
		);
	}
}
