import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { Emprestimos } from '../../../models/emprestimos';
import { EmprestimoService } from '../../../services/emprestimo-service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import * as html2pdf from 'html2pdf.js';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { DataService } from '../../../services/data-service';

@Component({
	selector: 'app-emprestimo-list',
	standalone: true,
	imports: [FormsModule, MdbFormsModule, DatePipe, NgxMaskDirective, NgxMaskPipe],
	templateUrl: './emprestimo-list.component.html',
	styleUrl: './emprestimo-list.component.scss',
	providers: [provideNgxMask()]
})
export class EmprestimoListComponent {
	lista: Emprestimos[] = [];
	emprestimo!: Emprestimos;
	dataRetirada: Date | undefined;
	dataDevolucao: Date | undefined;
	situacao: string = '';
	patrimonio: string = '';
	ra: string = '';
	usuario: string = '';


	emprestimoService = inject(EmprestimoService);
	dataService = inject(DataService);

	constructor() {
		this.findAll();
	}

	findAll() {
		this.emprestimoService.findAll().subscribe({
			next: (list) => {
				//Equivalente ao TRy
				this.lista = list;
			},
			error: (erro) => {
				// Equivalente ao CATCH ou EXCEPTIONS
				Swal.fire('Erro', erro.error, 'error');
			},
		});
	}

	// Método para filtrar campos
	filtrarCampos() {
	
		this.emprestimoService.findByFilter(this.dataRetirada, this.dataDevolucao, this.situacao, this.ra, this.usuario, this.patrimonio).subscribe({
		  next: (list) => {
			this.lista = list;
		  },
		  error: (erro) => {
			console.log(erro);
			Swal.fire("Erro", erro.error, 'error');
		  }
		});
	  }

	// Função para gerar o PDF
	imprimirRelatorio() {
		const element = document.getElementById('pdfContent');
		const options = {
			margin: 1,
			filename: 'relatorio.pdf',
			image: { type: 'jpeg', quality: 0.98 },
			html2canvas: { scale: 1, scrollY: 0 },
			jsPDF: { unit: 'cm', format: 'A4', orientation: 'portrait' },
		};

		if (element) {
			// Use html2pdf como uma função global
			(window as any).html2pdf().set(options).from(element).save();
		}
	}

	limparCampos(){
		this.dataRetirada = undefined;
		this.dataDevolucao = undefined;
		this.situacao = '';
		this.patrimonio = '';
		this.ra = '';
		this.usuario = '';
		this.findAll();
	}
}
