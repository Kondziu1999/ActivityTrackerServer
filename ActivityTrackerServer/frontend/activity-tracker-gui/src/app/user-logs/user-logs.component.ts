import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/users-models';
import { UsersService } from '../service/users.service';

@Component({
  selector: 'app-user-logs',
  templateUrl: './user-logs.component.html',
  styleUrls: ['./user-logs.component.scss']
})
export class UserLogsComponent implements OnInit {
  public user: User;

  constructor(
    private usersService: UsersService,
    private route:ActivatedRoute,
    private router: Router
  ) { }

  public ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    this.usersService.getUser(userId).subscribe(result => {
      this.user = result;
    });
  }

  public goBackToUsers(): void {
    this.router.navigate(['']);
  }

}
