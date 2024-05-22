import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeserveCatListComponent } from './deserve-cat-list.component';

describe('DeserveCatListComponent', () => {
  let component: DeserveCatListComponent;
  let fixture: ComponentFixture<DeserveCatListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeserveCatListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeserveCatListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
