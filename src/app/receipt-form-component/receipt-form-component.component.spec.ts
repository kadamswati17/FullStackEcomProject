import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptFormComponentComponent } from './receipt-form-component.component';

describe('ReceiptFormComponentComponent', () => {
  let component: ReceiptFormComponentComponent;
  let fixture: ComponentFixture<ReceiptFormComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReceiptFormComponentComponent]
    });
    fixture = TestBed.createComponent(ReceiptFormComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
