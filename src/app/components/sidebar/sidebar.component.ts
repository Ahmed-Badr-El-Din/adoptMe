import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgClass } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core'; //  استيراد Pipe الترجمة


@Component({
  standalone: true,
  selector: 'app-sidebar',
  imports: [RouterModule, NgClass, TranslateModule], //  إضافة TranslateModule
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Input() isOpen = true;
}
