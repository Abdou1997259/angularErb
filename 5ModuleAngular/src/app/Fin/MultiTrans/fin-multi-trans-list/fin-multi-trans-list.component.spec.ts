import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinMultiTransListComponent } from './fin-multi-trans-list.component';

describe('FinMultiTransListComponent', () => {
  let component: FinMultiTransListComponent;
  let fixture: ComponentFixture<FinMultiTransListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinMultiTransListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinMultiTransListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
