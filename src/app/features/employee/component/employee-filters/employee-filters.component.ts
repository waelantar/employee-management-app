import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-filters',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './employee-filters.component.html',
  styleUrl: './employee-filters.component.scss'
})
export class EmployeeFiltersComponent {
  filterCriteria = {
    firstName: '',
    lastName: '',
    email: '',
    minAge: null,
    maxAge: null,
    minSalary: null,
    maxSalary: null,
  };

  @Output() filterEmployees = new EventEmitter<any>();

  applyFilter() {
    this.filterEmployees.emit(this.filterCriteria);
  }
}
