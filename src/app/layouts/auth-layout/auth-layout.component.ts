import { Component } from '@angular/core';
import { RouterModule } from "@angular/router";
import { TopbarComponent } from "../../components/topbar/topbar.component";

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterModule, TopbarComponent],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css'
})
export class AuthLayoutComponent {

}
