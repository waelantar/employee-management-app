import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
export const routes: Routes = [
    {
      path: '',
      redirectTo: '/employees',
      pathMatch: 'full',
    },
    {
      path: 'employees',
      loadChildren: () => import('./features/employee/employees.module').then(m=>m.EmployeesModule),

    },
    {
      path: '**',
      component: PageNotFoundComponent,
    },
  ];

