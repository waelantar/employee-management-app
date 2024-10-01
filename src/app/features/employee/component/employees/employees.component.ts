import { Component } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../../../core/models/employee.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss'
})
export class EmployeesComponent {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  pageSize = 10;
  currentPage = 1;
  totalPages = 0;
  searchTerm = '';
  sortColumn = '';
  sortDirection = 'asc';
  showAddEmployeeForm = false;
  filterCriteria = {
    firstName: '',
    lastName: '',
    email: '',
    minAge: null,
    maxAge: null,
    minSalary: null,
    maxSalary: null,
  };
  showFilter = false;
  constructor(private employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.fetchEmployees();
    
  }
  fetchEmployees() {
    this.employeeService.getEmployees().subscribe(data => {
      this.employees = data;
        this.filteredEmployees = [...this.employees];
        this.updatePagination();
      },
      (error) => {
        console.error('Error fetching employees:', error);
      }
    );
  }
  updatePagination() {
    this.totalPages = Math.ceil(this.filteredEmployees.length / this.pageSize);
    this.currentPage = 1;
  }
  changePage(page: number) {
    this.currentPage = page;
  }

  changePageSize(size: number) {
    this.pageSize = size;
    this.updatePagination();
  }

  sortData(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredEmployees.sort((a, b) => {
      const aValue = a[column as keyof Employee];
      const bValue = b[column as keyof Employee];
    
      if (aValue == null && bValue == null) return 0;  
      if (aValue == null) return this.sortDirection === 'asc' ? 1 : -1;  
      if (bValue == null) return this.sortDirection === 'asc' ? -1 : 1;
    
      if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }
  toggleFilter() {
    this.showFilter = !this.showFilter;
  }
  
  filterEmployees() {
    this.filteredEmployees = this.employees.filter((employee) => {
      // Filter by first name, last name, and email
      const firstNameMatch = !this.filterCriteria.firstName || employee.firstName?.toLowerCase().includes(this.filterCriteria.firstName.toLowerCase());
      const lastNameMatch = !this.filterCriteria.lastName || employee.lastName?.toLowerCase().includes(this.filterCriteria.lastName.toLowerCase());
      const emailMatch = !this.filterCriteria.email || employee.email?.toLowerCase().includes(this.filterCriteria.email.toLowerCase());
  
      // Filter by age range
      const ageMatch = (!this.filterCriteria.minAge || employee.age >= this.filterCriteria.minAge) &&
                       (!this.filterCriteria.maxAge || employee.age <= this.filterCriteria.maxAge);
  
      // Filter by salary range
      const salaryMatch = (!this.filterCriteria.minSalary || employee.salary >= this.filterCriteria.minSalary) &&
                          (!this.filterCriteria.maxSalary || employee.salary <= this.filterCriteria.maxSalary);
  
  
      // Combine all filters
      return firstNameMatch && lastNameMatch && emailMatch && ageMatch && salaryMatch ;
    });
    this.updatePagination();
  }
  

  deleteEmployee(id: number) {
    this.employees = this.employees.filter((employee) => employee.id !== id);
    this.filterEmployees();
  }

  addEmployee(employee: Employee) {
    this.employees.push(employee);
    this.filterEmployees();
  }

  get paginatedEmployees() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredEmployees.slice(startIndex, startIndex + this.pageSize);
  }
  pagesAroundCurrent(): number[] {
    const maxVisiblePages = 5; // Number of pages to show around the current page
    const pages = [];

    // Determine the start and end pages to show
    const start = Math.max(2, this.currentPage - Math.floor(maxVisiblePages / 2));
    const end = Math.min(this.totalPages - 1, this.currentPage + Math.floor(maxVisiblePages / 2));

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  // Whether to show the ellipsis before the current page
  shouldShowLeftEllipsis(): boolean {
    return this.currentPage > 3;
  }

  // Whether to show the ellipsis after the current page
  shouldShowRightEllipsis(): boolean {
    return this.currentPage < this.totalPages - 2;
  }
}
