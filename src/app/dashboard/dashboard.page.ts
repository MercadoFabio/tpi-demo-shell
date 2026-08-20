import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-dashboard-page',
  styleUrl: './dashboard.page.scss',
  templateUrl: './dashboard.page.html',
})
export class DashboardPage {}
