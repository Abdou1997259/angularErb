import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResturantInvoice2BillComponent } from './resturant-invoice2-bill.component';

describe('ResturantInvoice2BillComponent', () => {
  let component: ResturantInvoice2BillComponent;
  let fixture: ComponentFixture<ResturantInvoice2BillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResturantInvoice2BillComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResturantInvoice2BillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
