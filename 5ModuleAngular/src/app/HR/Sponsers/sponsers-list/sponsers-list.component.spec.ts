import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SponsersListComponent } from './sponsers-list.component';

describe('SponsersListComponent', () => {
  let component: SponsersListComponent;
  let fixture: ComponentFixture<SponsersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SponsersListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SponsersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
