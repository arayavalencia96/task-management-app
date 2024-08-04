import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MsalModule, MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterOutlet, MsalModule],
  templateUrl: './landing.component.html',
})
export class LandingComponent {
  private msalService = inject(MsalService);
  login() {
    this.msalService.loginRedirect();
  }
}
