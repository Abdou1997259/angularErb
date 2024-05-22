import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectServerSideComponent } from './select-server-side.component';

describe('SelectServerSideComponent', () => {
  let component: SelectServerSideComponent;
  let fixture: ComponentFixture<SelectServerSideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectServerSideComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectServerSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
