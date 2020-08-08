import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DragPlaceholderComponent } from './drag-placeholder.component';

describe('DragPlaceholderComponent', () => {
  let component: DragPlaceholderComponent;
  let fixture: ComponentFixture<DragPlaceholderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DragPlaceholderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DragPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
