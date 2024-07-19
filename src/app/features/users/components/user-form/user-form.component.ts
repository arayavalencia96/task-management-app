import { Component, input } from '@angular/core';
import { User } from '@users/models/user.interface';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [],
  templateUrl: './user-form.component.html',
})
export class UserFormComponent {
  user = input<User>();
}
