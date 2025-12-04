import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptListComponentComponent } from './receipt-list-component.component';

describe('ReceiptListComponentComponent', () => {
  let component: ReceiptListComponentComponent;
  let fixture: ComponentFixture<ReceiptListComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReceiptListComponentComponent]
    });
    fixture = TestBed.createComponent(ReceiptListComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
