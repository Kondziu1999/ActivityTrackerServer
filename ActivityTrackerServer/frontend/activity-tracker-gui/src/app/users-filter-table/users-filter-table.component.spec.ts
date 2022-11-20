import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersFilterTableComponent } from './users-filter-table.component';

describe('UsersFilterTableComponent', () => {
  let component: UsersFilterTableComponent;
  let fixture: ComponentFixture<UsersFilterTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersFilterTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersFilterTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
