import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectorRequestListComponent } from './collector-request-list.component';

describe('CollectorRequestListComponent', () => {
  let component: CollectorRequestListComponent;
  let fixture: ComponentFixture<CollectorRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectorRequestListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CollectorRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
