import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelaynodesComponent } from './relaynodes.component';

describe('RelaynodesComponent', () => {
  let component: RelaynodesComponent;
  let fixture: ComponentFixture<RelaynodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelaynodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelaynodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
