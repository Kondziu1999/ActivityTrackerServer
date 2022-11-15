import { Component, OnInit } from '@angular/core';
import { NavbarOption } from '../helpers/navbar-option.enum';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public navbarOption = NavbarOption;
	public selectedOption: NavbarOption = this.navbarOption.Users;

  constructor() { }

  public ngOnInit(): void {

  }

  public changeOption(option: NavbarOption): void {
    this.selectedOption = option;
  }
}
