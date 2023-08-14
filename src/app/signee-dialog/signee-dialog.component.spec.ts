import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SigneeDialogComponent } from './signee-dialog.component';

describe('SigneeDialogComponent', () => {
  let component: SigneeDialogComponent;
  let fixture: ComponentFixture<SigneeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SigneeDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SigneeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
