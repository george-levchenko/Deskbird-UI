import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { AuthService } from './utils/services/auth.service';
import { Store } from '@ngrx/store';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, JwtModule.forRoot({})],
      providers: [AuthService, JwtHelperService, Store],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
