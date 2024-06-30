import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {BillCalculatorComponent} from "./bill-calculator/BillCalculatorComponent";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BillCalculatorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'electricity-bill-calculator';
}
