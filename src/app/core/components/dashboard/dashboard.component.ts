import { Component, inject } from '@angular/core';
import { ShowSectionService } from '@core/services/show-section.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  showSectionService = inject(ShowSectionService);
  showSection(section: string): void {
    this.showSectionService.setIsForUsersOrTasks(section);
  }
}
