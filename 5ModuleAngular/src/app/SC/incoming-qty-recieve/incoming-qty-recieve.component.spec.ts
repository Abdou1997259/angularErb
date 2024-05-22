import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingQtyRecieveComponent } from './incoming-qty-recieve.component';

describe('IncomingQtyRecieveComponent', () => {
  let component: IncomingQtyRecieveComponent;
  let fixture: ComponentFixture<IncomingQtyRecieveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncomingQtyRecieveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomingQtyRecieveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
