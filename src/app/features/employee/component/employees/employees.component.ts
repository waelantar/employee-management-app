import { Component } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../../../core/models/employee.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddEmployeeModalComponent } from '../add-employee-modal/add-employee-modal.component';
import { EmployeeFiltersComponent } from '../employee-filters/employee-filters.component';
import { EmployeeTableComponent } from '../employee-table/employee-table.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [FormsModule, CommonModule, AddEmployeeModalComponent,EmployeeFiltersComponent,EmployeeTableComponent,PaginationComponent],
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
  page: number = 1; // For pagination
  totalEmployees: number = 0; // Total number of employees
  showAddModal: boolean = false; // To control the visibility of the Add Employee modal

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
  
  filterEmployees(filterCriteria:any) {
    console.log(filterCriteria)
    this.filteredEmployees = this.employees.filter((employee) => {
      // Filter by first name, last name, and email
      const firstNameMatch = !filterCriteria.firstName || employee.firstName?.toLowerCase().includes(filterCriteria.firstName.toLowerCase());
      const lastNameMatch = !filterCriteria.lastName || employee.lastName?.toLowerCase().includes(filterCriteria.lastName.toLowerCase());
      const emailMatch = !filterCriteria.email || employee.email?.toLowerCase().includes(filterCriteria.email.toLowerCase());
  
      // Filter by age range
      const ageMatch = (!filterCriteria.minAge || employee.age >= filterCriteria.minAge) &&
                       (!filterCriteria.maxAge || employee.age <= filterCriteria.maxAge);
  
      // Filter by salary range
      const salaryMatch = (!filterCriteria.minSalary || employee.salary >= filterCriteria.minSalary) &&
                          (!filterCriteria.maxSalary || employee.salary <= filterCriteria.maxSalary);
  
  
      // Combine all filters
      return firstNameMatch && lastNameMatch && emailMatch && ageMatch && salaryMatch ;
    });
    this.updatePagination();
  }
  

  deleteEmployee(id: number) {
    this.employees = this.employees.filter((employee) => employee.id !== id);
    this.updatePagination();
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
  openAddEmployeeModal() {
    this.showAddEmployeeForm = true;
  }

 

  // Function to handle the added employee
  handleEmployeeAdded(newEmployee: any) {
    console.log(newEmployee);
    this.employees.push(newEmployee); 
    this.filteredEmployees = [...this.employees]; 
    this.showAddEmployeeForm = false;
  }
  onPageChange(page: number) {
    this.page = page; // Update current page
  }
}