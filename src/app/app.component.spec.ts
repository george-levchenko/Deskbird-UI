import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthService } from './utils/services/auth.service';
import { provideStore } from '@ngrx/store';
import { reducers } from './store';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, JwtModule.forRoot({}), provideStore(reducers)],
      providers: [AuthService],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
