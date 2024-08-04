import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-failed',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './failed.component.html',
  styleUrl: './failed.component.scss',
})
export class FailedComponent {
  private router = inject(Router);

  goToLanding() {
    this.router.navigate(['/']);
  } 
}
