import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportOrderListComponent } from './import-order-list.component';

describe('ImportOrderListComponent', () => {
  let component: ImportOrderListComponent;
  let fixture: ComponentFixture<ImportOrderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportOrderListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
