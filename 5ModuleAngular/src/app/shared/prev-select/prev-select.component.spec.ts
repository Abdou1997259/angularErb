import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrevSelectComponent } from './prev-select.component';

describe('PrevSelectComponent', () => {
  let component: PrevSelectComponent;
  let fixture: ComponentFixture<PrevSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrevSelectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrevSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
