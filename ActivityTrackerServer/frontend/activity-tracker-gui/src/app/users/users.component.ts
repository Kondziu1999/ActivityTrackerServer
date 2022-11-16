import { Component, OnInit } from '@angular/core';
import { UsersOverviewQuery } from '../models/users-models';
import { UsersService } from '../service/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {

    const usersOverviewQuery: UsersOverviewQuery = {
      page: 0,
      pageSize: 30,
      sortingDirection: 1

    };

    this.usersService.getUsersOverview(usersOverviewQuery).subscribe(result => {
      console.log(result);
    })

    this.usersService.getUser(1).subscribe(result => {
      console.log(result);
    })
  }

}
