import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SamplreComponent } from './samplre.component';

describe('SamplreComponent', () => {
  let component: SamplreComponent;
  let fixture: ComponentFixture<SamplreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SamplreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SamplreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
