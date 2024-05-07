import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfterLoginComponent } from './after-login.component';

describe('AfterLoginComponent', () => {
  let component: AfterLoginComponent;
  let fixture: ComponentFixture<AfterLoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AfterLoginComponent]
    });
    fixture = TestBed.createComponent(AfterLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
