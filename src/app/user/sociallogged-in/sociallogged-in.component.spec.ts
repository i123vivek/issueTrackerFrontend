import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialloggedInComponent } from './sociallogged-in.component';

describe('SocialloggedInComponent', () => {
  let component: SocialloggedInComponent;
  let fixture: ComponentFixture<SocialloggedInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialloggedInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialloggedInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
