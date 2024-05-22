import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinMultiTransAddComponent } from './fin-multi-trans-add.component';

describe('FinMultiTransAddComponent', () => {
  let component: FinMultiTransAddComponent;
  let fixture: ComponentFixture<FinMultiTransAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinMultiTransAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinMultiTransAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
