import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  private msalService = inject(MsalService);

  @Input() loginDisplay: boolean = false;
  @Input() name: string | undefined = '';

  login() {
    this.msalService.loginRedirect();
  }

  logout() {
    this.msalService.logoutRedirect();
  }
}
