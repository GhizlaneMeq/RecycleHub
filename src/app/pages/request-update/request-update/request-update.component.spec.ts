import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestUpdateComponent } from './request-update.component';

describe('RequestUpdateComponent', () => {
  let component: RequestUpdateComponent;
  let fixture: ComponentFixture<RequestUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RequestUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
