import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './utils/services/auth.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [AuthService, JwtHelperService],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
