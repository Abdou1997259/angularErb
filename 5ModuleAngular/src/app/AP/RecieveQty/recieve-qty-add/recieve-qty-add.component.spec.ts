import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecieveQtyAddComponent } from './recieve-qty-add.component';

describe('RecieveQtyAddComponent', () => {
  let component: RecieveQtyAddComponent;
  let fixture: ComponentFixture<RecieveQtyAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecieveQtyAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecieveQtyAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
