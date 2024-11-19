import { inject, Injectable } from '@angular/core';
import { Usuarios } from '../models/usuarios';
import { BehaviorSubject, Observable } from 'rxjs';
import { UsuarioService } from './usuario-service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Login } from '../models/login';
import { jwtDecode, JwtPayload } from "jwt-decode";

@Injectable({
	providedIn: 'root',
})
export class AutenticarService {
	http = inject(HttpClient);
	API = 'http://26.188.107.159:8080/api/usuarios';

	usuario: Usuarios = new Usuarios();
	usuarioService = inject(UsuarioService);
	router = inject(Router);

	login(login: Login): Observable<string> {
		return this.http.post<string>(this.API + '/login', login, { responseType: 'text' as 'json' });
	}

	getUsuarioAutenticado(): Usuarios | null {
    let user = this.jwtDecode() as Usuarios;
    return user;

	}

	logout() {
		localStorage.removeItem('token');
		this.router.navigate(['login']);
	}

  addToken(token: string) {
    localStorage.setItem('token', token);
  }

  removerToken() {
    localStorage.removeItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  jwtDecode() {
    let token = this.getToken();
    if (token) {
      return jwtDecode<JwtPayload>(token);
    }
    return "";
  }

  hasPermission(role: string) {
    let user = this.jwtDecode() as Usuarios;
    if (user.role == role)
      return true;
    else
      return false;
  }

}