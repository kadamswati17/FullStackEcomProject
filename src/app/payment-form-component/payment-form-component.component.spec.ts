import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentFormComponentComponent } from './payment-form-component.component';

describe('PaymentFormComponentComponent', () => {
  let component: PaymentFormComponentComponent;
  let fixture: ComponentFixture<PaymentFormComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentFormComponentComponent]
    });
    fixture = TestBed.createComponent(PaymentFormComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
