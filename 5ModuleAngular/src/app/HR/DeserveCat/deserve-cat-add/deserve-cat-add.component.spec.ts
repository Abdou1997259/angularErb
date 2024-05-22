import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeserveCatAddComponent } from './deserve-cat-add.component';

describe('DeserveCatAddComponent', () => {
  let component: DeserveCatAddComponent;
  let fixture: ComponentFixture<DeserveCatAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeserveCatAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeserveCatAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
