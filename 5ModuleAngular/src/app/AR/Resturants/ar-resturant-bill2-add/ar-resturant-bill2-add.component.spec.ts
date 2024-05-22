import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArResturantBill2AddComponent } from './ar-resturant-bill2-add.component';

describe('ArResturantBill2AddComponent', () => {
  let component: ArResturantBill2AddComponent;
  let fixture: ComponentFixture<ArResturantBill2AddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArResturantBill2AddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArResturantBill2AddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
