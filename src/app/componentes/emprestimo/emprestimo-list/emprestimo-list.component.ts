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
import { LoginService } from '../../../auth/login.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

	// Variáveis de paginação
	currentPage: number = 1; // Página atual (começa em 1 para o usuário)
	pageSize: number = 10; // Itens por página
	totalItems: number = 0; // Total de itens
	totalPages: number = 0; // Total de páginas
	pageSizeOptions: number[] = [5, 10, 25, 50, 100, 250, 500];


	emprestimoService = inject(EmprestimoService);
	dataService = inject(DataService);
	loginService = inject(LoginService);

	constructor() {
		this.loadPage();
	  }
	
	  loadPage() {
		// Ajuste apenas para a chamada da API
		const pageToSend = this.currentPage - 1;
		
		this.emprestimoService.findAllPage(pageToSend, this.pageSize).subscribe((data: any) => {
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

	// Método para filtrar campos
	// filtrarCampos() {
	
	// 	this.emprestimoService.findByFilter(this.dataRetirada, this.dataDevolucao, this.situacao, this.ra, this.usuario, this.patrimonio).subscribe({
	// 	  next: (list) => {
	// 		this.lista = list.sort((a, b) => new Date(b.dataRetirada).getTime() - new Date(a.dataRetirada).getTime());
	// 	  },
	// 	  error: (erro) => {
	// 		console.log(erro);
	// 		Swal.fire("Erro", erro.error, 'error');
	// 	  }
	// 	});
	//   }
	  
	filtrarCampos() {
		this.emprestimoService.findByFilter(
			this.dataRetirada, this.dataDevolucao, this.situacao, this.ra, this.usuario, this.patrimonio
		).subscribe({
			next: (list: Emprestimos[]) => {
				this.lista = list.sort((a: Emprestimos, b: Emprestimos) => 
					new Date(b.dataRetirada).getTime() - new Date(a.dataRetirada).getTime()
				);
				this.currentPage = 1; // Reinicia a paginação
				this.totalPages = 1; // Garante que tudo será exibido em uma única página
			},
			error: (erro) => {
				console.log(erro);
				Swal.fire("Erro", erro.error, 'error');
			}
		});
	}
	
	
	
	
		confirmarEncerramento(emprestimo: Emprestimos) {
		Swal.fire({
			title: "Tem certeza?",
			text: `Deseja realmente encerrar o empréstimo para o aluno ${emprestimo.aluno.nome}?`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Sim, encerrar!",
			cancelButtonText: "Cancelar"
		}).then((result) => {
			if (result.isConfirmed) {
				this.encerrarEmprestimo(emprestimo);
			}
		});
	}

	encerrarEmprestimo(emprestimo: Emprestimos) {
		this.emprestimoService.encerrar(emprestimo.id, emprestimo).subscribe({
			next: () => {
				Swal.fire({
					toast: true,
					position: "bottom-end",
					icon: "success",
					title: "Empréstimo encerrado com sucesso!",
					showConfirmButton: false,
					timer: 3000
				});
				this.loadPage(); // Atualiza a lista após encerrar
			},
			error: erro => {
				console.error("Erro ao encerrar empréstimo:", erro);
				Swal.fire("Erro", "Não foi possível encerrar o empréstimo.", "error");
			}
		});
	}
	
	

	// imprimirRelatorio() {
	// 	const element = document.getElementById('pdfContent');
	// 	const header = element?.querySelector('.header-container') as HTMLElement;
	  
	// 	const options = {
	// 	  margin: 0.5,
	// 	  filename: 'relatorioEasyNote.pdf',
	// 	  image: { type: 'jpeg', quality: 0.98 },
	// 	  html2canvas: { scale: 3, scrollY: 0, useCORS: true },
	// 	  jsPDF: { unit: 'cm', format: 'A4', orientation: 'landscape' },
	// 	};
	  
	// 	if (element && header) {
	// 	  header.style.visibility = 'visible'; // Mantém o header visível, mas sem afetar o layout
	  
	// 	  setTimeout(() => {
	// 		(window as any).html2pdf().set(options).from(element).save().then(() => {
	// 		  header.style.visibility = 'hidden'; // Oculta o header de volta
	// 		});
	// 	  }, 500); // Pequeno delay para evitar problemas na renderização
	// 	}
	//   }
	  

	  exportarParaPDF() {
		const tabela = document.getElementById('relatorioList');
	
		if (!tabela) {
		  console.error("Tabela não encontrada!");
		  return;
		}
	
		// 1️⃣ Salvar configurações atuais
		const paginaAtual = this.currentPage;
		const tamanhoPaginaAnterior = this.pageSize;
	
		// 2️⃣ Ajustar a paginação para exibir todos os registros filtrados
		this.pageSize = this.totalItems || 500; // Máximo de registros filtrados
		this.currentPage = 1;
	
		// 3️⃣ Tempo para a tabela recarregar com os novos dados
		setTimeout(() => {
		  html2canvas(tabela, { scale: 2 }).then(canvas => {
			const imgData = canvas.toDataURL('image/png');
			const pdf = new jsPDF('p', 'mm', 'a4');
	
			const imgWidth = 190;
			const imgHeight = (canvas.height * imgWidth) / canvas.width;
	
			pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
			pdf.save('relatorio_filtrado.pdf');
	
			// 4️⃣ Restaurar paginação original
			this.pageSize = tamanhoPaginaAnterior;
			this.currentPage = paginaAtual;
		  });
		}, 500); // Tempo para atualização da tabela antes da exportação
	  }


	limparCampos(){
		this.dataRetirada = undefined;
		this.dataDevolucao = undefined;
		this.situacao = '';
		this.patrimonio = '';
		this.ra = '';
		this.usuario = '';
		this.loadPage();
	}
}
