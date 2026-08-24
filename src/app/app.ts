import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { buttonClass, cardClass, fieldClass } from '@tpi-demo/ui-kit';
import { AuthService } from './auth.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, RouterLink, RouterLinkActive, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  private readonly auth = inject(AuthService);
  protected email = '';
  protected password = '';
  protected errorMessage = '';
  protected readonly buttonClass = buttonClass;
  protected readonly cardClass = cardClass;
  protected readonly fieldClass = fieldClass;
  protected readonly session = this.auth.session;

  protected login(): void {
    this.errorMessage = '';
    this.auth.login(this.email, this.password).subscribe({
      error: () => this.errorMessage = 'No fue posible iniciar sesión. Verificá tus credenciales.',
    });
  }

  protected logout(): void {
    this.auth.logout().subscribe({
      error: () => this.errorMessage = 'La sesión ya no es válida. Volvé a iniciar sesión.',
    });
  }
}
