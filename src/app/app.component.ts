import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'poc-lint-prettier';

  /*
  funcaoNova() {
    var totalmente_errado = "aaaaa";
    return totalmente_errado;
  }
  */

  funcaoNova(): string {
    const totalmenteErrado = 'aaaaa';
    return totalmenteErrado;
  }
}
