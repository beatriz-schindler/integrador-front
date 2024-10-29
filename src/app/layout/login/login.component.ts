import { Component, ElementRef, ViewChild, OnInit, inject } from '@angular/core';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { Login } from '../../models/login';
import { Usuarios } from '../../models/usuarios';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario-service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AutenticarService } from '../../services/autenticar-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MdbFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  @ViewChild('loginVideo', { static: true }) loginVideo!: ElementRef<HTMLVideoElement>;

  login: Login = new Login();
  usuario: Usuarios = new Usuarios();
  router = inject(Router);
  usuarioService = inject(UsuarioService);
  usuarioAutenticado = inject(AutenticarService);

  ngOnInit() {
    this.tryPlayVideo();
  }

  tryPlayVideo() {
    const video = this.loginVideo.nativeElement;

    // Força o vídeo a estar em 'muted' para permitir autoplay
    video.muted = true;

    video.play().catch(error => {
      console.error("Erro ao tentar reproduzir o vídeo:", error);

      // Listener para interação do usuário se o autoplay falhar
      document.addEventListener('click', () => {
        video.play();
      }, { once: true });
    });
  }

  autenticar() {
    this.usuarioAutenticado.findByLogin(this.login.usuario, this.login.senha);
  }

  
}