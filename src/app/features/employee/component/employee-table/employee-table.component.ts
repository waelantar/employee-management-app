import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Employee } from '../../../../core/models/employee.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-table',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './employee-table.component.html',
  styleUrl: './employee-table.component.scss'
})
export class EmployeeTableComponent {
  @Input() employees: Employee[] = [];
   sortColumn: string = '';
   sortDirection: string = '';
  @Output() deleteEmployee = new EventEmitter<number>();
  @Output() sortData = new EventEmitter<string>();

  handleDelete(id: number) {
    this.deleteEmployee.emit(id);
  }
  

  handleSort(column: string) {
    this.sortColumn=column;
    this.sortData.emit(column);
  }
}
