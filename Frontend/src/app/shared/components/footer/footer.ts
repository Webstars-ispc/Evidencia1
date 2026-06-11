import { Component, inject, signal } from '@angular/core';
import { RouterLink} from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  auth = inject(AuthService);
}
