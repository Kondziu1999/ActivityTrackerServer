import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { NavbarOption } from '../helpers/navbar-option.enum';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  private readonly frontedUrl = environment.frontendUrl;

  public navbarOption = NavbarOption;
  public selectedOption: NavbarOption;

  constructor() { }

  public ngOnInit(): void {
    this.selectedOption = window.location.href === this.frontedUrl ? this.navbarOption.Users : this.navbarOption.Endpoints;

  }

  public changeOption(option: NavbarOption): void {
    this.selectedOption = option;
  }
}
