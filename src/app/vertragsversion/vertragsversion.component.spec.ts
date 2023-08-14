import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VertragsversionComponent } from './vertragsversion.component';

describe('VertragsversionComponent', () => {
  let component: VertragsversionComponent;
  let fixture: ComponentFixture<VertragsversionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VertragsversionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VertragsversionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
