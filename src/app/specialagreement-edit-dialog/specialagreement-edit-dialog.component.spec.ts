import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialagreementEditDialogComponent } from './specialagreement-edit-dialog.component';

describe('SpecialagreementEditDialogComponent', () => {
  let component: SpecialagreementEditDialogComponent;
  let fixture: ComponentFixture<SpecialagreementEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpecialagreementEditDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialagreementEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
