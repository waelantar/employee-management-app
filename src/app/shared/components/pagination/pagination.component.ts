import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Input() pageSize: number = 10;
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();
  Begin:number=0;
 

  changePageSize(size: number) {
    this.pageSizeChange.emit(size);
  }
 
  getVisiblePages(): number[] {
    const visiblePages: number[] = [];
    const maxVisible = 2;

    if (this.totalPages <= maxVisible ) {
      // If total pages are few, show all
      for (let i = 1; i <= this.totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      // Always add first page
      visiblePages.push(1);

      if (this.currentPage <= 3) {
        // Near the start
        for (let i = 2; i <= 5; i++) {
          visiblePages.push(i);
        }
      } else if (this.currentPage >= this.totalPages - 2) {
        // Near the end
        for (let i = this.totalPages - 4; i < this.totalPages; i++) {
          visiblePages.push(i);
        }
      } else {
        // Middle case
        for (let i = this.currentPage - 2; i <= this.currentPage + 2; i++) {
          visiblePages.push(i);
        }
      }

      // Always add last page
      if (visiblePages[visiblePages.length - 1] !== this.totalPages) {
        visiblePages.push(this.totalPages);
      }
    }

    return visiblePages;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }

  

  showStartEllipsis(): boolean {
    return this.getVisiblePages()[1] > 2;
  }

  showEndEllipsis(): boolean {
    const visiblePages = this.getVisiblePages();
    return visiblePages[visiblePages.length - 2] < this.totalPages - 1;
  }
}
