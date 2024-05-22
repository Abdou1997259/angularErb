import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecieveQtyListComponent } from './recieve-qty-list.component';

describe('RecieveQtyListComponent', () => {
  let component: RecieveQtyListComponent;
  let fixture: ComponentFixture<RecieveQtyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecieveQtyListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecieveQtyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
