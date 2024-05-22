import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeservedlyListComponent } from './deservedly-list.component';

describe('DeservedlyListComponent', () => {
  let component: DeservedlyListComponent;
  let fixture: ComponentFixture<DeservedlyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeservedlyListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeservedlyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
