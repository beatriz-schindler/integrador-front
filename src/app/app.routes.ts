import { Routes } from '@angular/router';
import { LoginComponent } from './layout/login/login.component';
import { PrincipalComponent } from './layout/principal/principal.component';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { EquipamentoListComponent } from './componentes/equipamento/equipamento-list/equipamento-list.component';
import { EquipamentoFormComponent } from './componentes/equipamento/equipamento-form/equipamento-form.component';
import { EmprestimoListComponent } from './componentes/emprestimo/emprestimo-list/emprestimo-list.component';
import { EmprestimoFormComponent } from './componentes/emprestimo/emprestimo-form/emprestimo-form.component';
import { AlunoListComponent } from './componentes/aluno/aluno-list/aluno-list.component';
import { UsuarioListComponent } from './componentes/usuario/usuario-list/usuario-list.component';
import { UsuarioFormComponent } from './componentes/usuario/usuario-form/usuario-form.component';

export const routes: Routes = [
    {path: "", redirectTo: "login", pathMatch: "full"},
    {path: "login", component: LoginComponent},
    {path:"admin", component: PrincipalComponent, children:[
        {path: "dashboard", component: DashboardComponent},
        {path: "equipamento", component: EquipamentoListComponent},
        {path: "equipamento/new", component: EquipamentoFormComponent},
        {path: "equipamento/edit/:id", component: EquipamentoFormComponent},
        {path: "relatorio", component: EmprestimoListComponent},
        {path: "emprestimo/new", component: EmprestimoFormComponent},
        {path: "aluno", component: AlunoListComponent},
        {path: "usuario", component: UsuarioListComponent},
        {path: "usuario/new", component: UsuarioFormComponent},
        {path: "usuario/edit/:id", component: UsuarioFormComponent},
    ]}
];
