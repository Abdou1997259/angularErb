import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StocktakingListComponent } from './stocktaking-list.component';

describe('StocktakingListComponent', () => {
  let component: StocktakingListComponent;
  let fixture: ComponentFixture<StocktakingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StocktakingListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StocktakingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
