import { Component, inject } from '@angular/core';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { Login } from '../../models/login';
import { Usuarios } from '../../models/usuarios';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario-service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MdbFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  login: Login = new Login();
  usuario: Usuarios = new Usuarios();
  router = inject(Router);

  usuarioService = inject(UsuarioService);

  autenticar(){
    this.findByLogin(this.login.usuario);

    // Verifica se o usuário foi encontrado e compara a senha
    if (this.usuario && this.usuario.senha === this.login.senha) {
      const Toast = Swal.mixin({
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "success",
        title: "Autenticado com sucesso!"
      });
      this.router.navigate(['admin/dashboard']);
      // Se o login e a senha estiverem corretos, redireciona para a página principal
      this.router.navigate(['admin/dashboard']);
    } else {
      // Caso contrário, exibe uma mensagem de erro
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "error",
        title: "Usuário ou senha incorretos!"
      });
    }
  }

  findByLogin(login: string){
    this.usuarioService.findByLogin(login).subscribe({
      next: user => {
        this.usuario = user;
      },
      error: erro => {
        alert('Deu erro');
      }
    })

  }

}
