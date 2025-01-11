import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditEmployeeComponent } from './Employee/add-edit-employee/add-edit-employee.component';
import { EmployeeListComponent } from './Employee/employee-list/employee-list.component';

const routes: Routes = [
  {
    path: 'employeelist',
    component: EmployeeListComponent,
  },
  {
    path: 'addemployee',
    component: AddEditEmployeeComponent,
  },
  {
    path: 'editemployee/:id',
    component: AddEditEmployeeComponent,
  },
  {
    path: '',
    redirectTo: 'employeelist',
    pathMatch: 'full'
  },
  {
    path:'**',
    redirectTo: 'employeelist',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
