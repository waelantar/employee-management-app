import { Component, EventEmitter, Output } from '@angular/core';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { Employee } from '../../../../core/models/employee.model';

@Component({
  selector: 'app-add-employee-modal',
  standalone: true,
  imports: [EmployeeFormComponent],
  templateUrl: './add-employee-modal.component.html',
  styleUrl: './add-employee-modal.component.scss'
})
export class AddEmployeeModalComponent {
  @Output() closeModal = new EventEmitter<void>();
  @Output() Employee = new EventEmitter<void>();
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  closed:boolean=false;
  close() {
    this.closeModal.emit();
  }
  handleEmployeeAdded(Employee: any) {

    this.Employee.emit(Employee);

this.close()  }
}
