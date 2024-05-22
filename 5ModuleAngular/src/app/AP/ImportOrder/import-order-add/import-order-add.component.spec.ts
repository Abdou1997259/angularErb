import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportOrderAddComponent } from './import-order-add.component';

describe('ImportOrderAddComponent', () => {
  let component: ImportOrderAddComponent;
  let fixture: ComponentFixture<ImportOrderAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportOrderAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportOrderAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
