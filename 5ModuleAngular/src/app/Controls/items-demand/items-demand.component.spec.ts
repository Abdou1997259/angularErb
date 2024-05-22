import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemsDemandComponent } from './items-demand.component';

describe('ItemsDemandComponent', () => {
  let component: ItemsDemandComponent;
  let fixture: ComponentFixture<ItemsDemandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemsDemandComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemsDemandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
