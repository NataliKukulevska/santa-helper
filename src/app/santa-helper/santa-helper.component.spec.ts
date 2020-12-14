import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SantaHelperComponent } from './santa-helper.component';

describe('SantaHelperComponent', () => {
  let component: SantaHelperComponent;
  let fixture: ComponentFixture<SantaHelperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SantaHelperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SantaHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
