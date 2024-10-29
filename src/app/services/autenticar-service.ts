import { inject, Injectable } from "@angular/core";
import { Usuarios } from "../models/usuarios";
import { BehaviorSubject } from "rxjs";
import { UsuarioService } from "./usuario-service";
import Swal from "sweetalert2";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
  })
export class AutenticarService {
    
    usuario: Usuarios = new Usuarios();
    usuarioService = inject(UsuarioService);
    router = inject(Router);

    findByLogin(login: string, senha: string) {
        this.usuarioService.findByLogin(login, senha).subscribe({
          next: user => {
            this.usuario = user;
            if (this.usuario && this.usuario.senha === senha) {
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
              console.log(this.usuario);
              localStorage.setItem('this.usuario', JSON.stringify(user)); // Salva o usuário no localStorage
              console.log("Usuário após local storage:", this.usuario);
              this.router.navigate(['admin/dashboard']);
            } else {
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
          },
          error: erro => {
            Swal.fire('Erro', erro.error, 'error');
          }
        });
      }

      getUsuarioAutenticado(): Usuarios | null {
        const usuarioData = localStorage.getItem('this.usuario');
        return usuarioData ? JSON.parse(usuarioData) : null;
    }

    }

    // setUsuario(usuario: Usuarios): Promise<void> {
    //     return new Promise((resolve, reject) => {
    //         if (!usuario || !usuario.id) {
    //             console.error('Usuário ou ID inválido:', usuario);
    //             reject('Usuário ou ID inválido');
    //             return;
    //         }
    
    //         this.usuarioService.findById(usuario.id).subscribe({
    //             next: user => {
    //                 console.log('Usuário encontrado:', user);
    //                 this.usuario = user;
    //                 resolve();
    //             },
    //             error: erro => {
    //                 console.error('Erro ao buscar usuário:', erro);
    //                 reject(erro);
    //             }
    //         });
    //     });
    // }
    
    
    // getUsuario(): Usuarios{
    //     console.log("Usuário recuperado:", this.usuario); 
    //     return this.usuario;
    // }

