import { Component, signal } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-blank-layout',
  standalone: true,
  imports: [SidebarComponent,TopbarComponent, RouterModule],
  templateUrl: './blank-layout.component.html',
  styleUrl: './blank-layout.component.css'
})
export class BlankLayoutComponent {
  isSidebarOpen = signal(true);

  toggleSidebar() {
    this.isSidebarOpen.update((open: boolean) => !open);
  }
}
