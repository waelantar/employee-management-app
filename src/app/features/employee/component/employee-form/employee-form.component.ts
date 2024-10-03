import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Employee } from '../../../../core/models/employee.model';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.scss'
})
export class EmployeeFormComponent {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  age: number | null = null;
  salary: number | null = null;
  dob: string = '';

  @Output() employeeAdded = new EventEmitter<any>();

  addEmployee(form: NgForm) {
    const newEmployee = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      age: this.age,
      salary: this.salary,
      dob: this.dob,
    };
    if (form.invalid) {
      return; 
    }
    // Emit the new employee object to the parent component
    this.employeeAdded.emit(newEmployee);

    // Reset form fields
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.age = null;
    this.salary = null;
    this.dob = '';
  }
}
