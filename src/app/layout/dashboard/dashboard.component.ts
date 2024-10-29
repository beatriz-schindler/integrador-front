import { Component, inject } from '@angular/core';
import { EmprestimoService } from '../../services/emprestimo-service';
import { Emprestimos } from '../../models/emprestimos';
import Swal from 'sweetalert2';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Color, ScaleType } from '@swimlane/ngx-charts'; // Importar Color e ScaleType

@Component({
	selector: 'app-dashboard',
	standalone: true,
	imports: [NgxChartsModule],
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
	lista: Emprestimos[] = [];
	emprestimosPorPatrimonio: any[] = [];
	emprestimosPorcurso = [
		{ name: 'Equipamento 1', value: 30 },
		{ name: 'Equipamento 2', value: 250 },
		{ name: 'Equipamento 3', value: 100 },
		{ name: 'Equipamento 4', value: 70 }
	];

	view: [number, number] = [700, 400];
	colorScheme: Color = {
		name: 'custom',  // Adicione um nome se necessário
		selectable: true,  // Adicione a propriedade 'selectable'
		group: ScaleType.Ordinal,  // Use ScaleType.Ordinal
		domain: [
			'#00E88F',  // Cor Principal
			'#fb7b01',  // Cor Secundária
			'#0058e6',  // Cor Ternária
			'#1e1e24'   // Cor Neutra
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
			if (equipamentoCountMap.has(patrimonio)) {
				equipamentoCountMap.set(patrimonio, equipamentoCountMap.get(patrimonio)! + 1);
			} else {
				equipamentoCountMap.set(patrimonio, 1);
			}
		});

		// Convertendo o Map para o formato necessário pelo ngx-charts
		this.emprestimosPorPatrimonio = Array.from(equipamentoCountMap, ([name, value]) => ({ name, value }));
	}
}
