import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialagreementsDialogComponent } from './specialagreements-dialog.component';

describe('SpecialagreementsDialogComponent', () => {
  let component: SpecialagreementsDialogComponent;
  let fixture: ComponentFixture<SpecialagreementsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpecialagreementsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialagreementsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
