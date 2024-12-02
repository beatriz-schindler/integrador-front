import { Component, inject } from '@angular/core';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { AutenticarService } from '../../services/autenticar-service';
import { LoginService } from '../../auth/login.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MdbCollapseModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  autenticarService = inject(AutenticarService);
  loginService = inject(LoginService);


}
