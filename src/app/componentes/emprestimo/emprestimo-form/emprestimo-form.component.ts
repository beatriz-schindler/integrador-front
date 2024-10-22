import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';

@Component({
  selector: 'app-emprestimo-form',
  standalone: true,
  imports: [MdbFormsModule, FormsModule],
  templateUrl: './emprestimo-form.component.html',
  styleUrl: './emprestimo-form.component.scss'
})
export class EmprestimoFormComponent {

}
