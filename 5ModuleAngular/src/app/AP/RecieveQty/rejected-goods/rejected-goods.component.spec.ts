import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedGoodsComponent } from './rejected-goods.component';

describe('RejectedGoodsComponent', () => {
  let component: RejectedGoodsComponent;
  let fixture: ComponentFixture<RejectedGoodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectedGoodsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectedGoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
