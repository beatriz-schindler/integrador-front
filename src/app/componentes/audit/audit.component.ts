import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { Auditoria } from '../../models/auditoria';
import { AuditoriaService } from '../../services/auditoria-service';
import { DatePipe } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { DataService } from '../../services/data-service';


@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [FormsModule,MdbFormsModule,DatePipe, NgxMaskDirective, MdbModalModule],
  templateUrl: './audit.component.html',
  styleUrl: './audit.component.scss',
  providers: [provideNgxMask()]
})
export class AuditComponent {

	entidade: String = '';
	Id!: number;
	createdBy: String = '';
	modifiedDate1: string = '';
	lastModifiedBy: String = '';
	modifiedDate2: string = '';

	// Variáveis de paginação
	currentPage: number = 1; // Página atual (começa em 1 para o usuário)
	pageSize: number = 10; // Itens por página
	totalItems: number = 0; // Total de itens
	totalPages: number = 0; // Total de páginas
	pageSizeOptions: number[] = [5, 10, 25, 50, 100, 250, 500];

	lista: Auditoria[] = [];
	auditoriaService = inject(AuditoriaService);
	dataService =inject(DataService);

	constructor(){
		this.loadPage();
	}

	loadPage() {
		this.filtrarCampos();
	};

	filtrarCampos() {

		const filtroDataInicio = this.dataService.converterInputParaLocalDateTime(this.modifiedDate1);
		const filtroDataFim = this.dataService.converterInputParaLocalDateTime(this.modifiedDate2); 

		const filtros = {
			entidade: this.entidade,
			criadoPor: this.createdBy,
			modificadoPor: this.lastModifiedBy,
			dataInicio: filtroDataInicio, // formato: yyyy-MM-dd
			dataFim: filtroDataFim
		};

		this.auditoriaService.listarTudo(filtros).subscribe({
			next: (data) => this.lista = data,
			error: (err) => console.error('Erro ao carregar auditorias', err)
		});
	}

	getAuditorias(){
		this.auditoriaService.listarTudo().subscribe({
			next: (data) => this.lista = data,
			error: (err) => console.error('Erro ao carregar auditorias', err)
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

	limparCampos(){
		this.entidade = '';         // Limpa o filtro entidade também
		this.createdBy = '';
		this.modifiedDate1 = '';
		this.lastModifiedBy = '';
		this.modifiedDate2 = '';
		this.currentPage = 1;
		this.pageSize = 10;
		this.loadPage();  
	}
}
