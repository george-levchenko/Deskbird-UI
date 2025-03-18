import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { UserFormComponent } from './user-form.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;

  describe('when creating a new user', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [UserFormComponent, ReactiveFormsModule],
        // Use NO_ERRORS_SCHEMA to ignore unknown primeng components/directives
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(UserFormComponent);
      component = fixture.componentInstance;
      // For creation scenario, override the getter of selectedUser to return a function that returns null.
      Object.defineProperty(component, 'selectedUser', { get: () => () => null });
      fixture.detectChanges();
    });

    it('should create the component and initialize the form with empty values', () => {
      expect(component).toBeTruthy();
      expect(component.form).toBeDefined();
      expect(component.form.get('username')?.value).toEqual('');
      expect(component.form.get('password')?.value).toEqual('');
      expect(component.form.get('name')?.value).toEqual('');
      expect(component.form.get('email')?.value).toEqual('');
      expect(component.form.get('isAdmin')?.value).toEqual(false);
    });

    it('should disable the submit button when the form is pristine or invalid', () => {
      fixture.detectChanges();
      const submitButton: HTMLButtonElement =
        fixture.nativeElement.querySelector('.submit-button button') || fixture.nativeElement.querySelector('.submit-button');
      expect(submitButton.disabled).toBeTrue();
    });

    it('should enable the submit button when the form is valid and dirty', () => {
      component.form.patchValue({
        username: 'newuser',
        password: 'password123',
        name: 'New User',
        email: 'newuser@example.com',
        isAdmin: true,
      });
      component.form.markAsDirty();
      fixture.detectChanges();
      const submitButton: HTMLButtonElement =
        fixture.nativeElement.querySelector('.submit-button button') || fixture.nativeElement.querySelector('.submit-button');
      expect(component.form.valid).toBeTrue();
      expect(submitButton.disabled).toBeFalse();
    });

    it('should emit submitUser with the complete payload on submit (including password when provided)', () => {
      spyOn(component.submitUser, 'emit');
      component.form.patchValue({
        username: 'newuser',
        password: 'password123',
        name: 'New User',
        email: 'newuser@example.com',
        isAdmin: true,
      });
      component.form.markAsDirty();
      component.onSubmit();
      expect(component.submitUser.emit).toHaveBeenCalledWith({
        username: 'newuser',
        password: 'password123',
        name: 'New User',
        email: 'newuser@example.com',
        isAdmin: true,
        id: undefined,
      });
    });

    it('should not include the password in the payload if the password field is empty', () => {
      spyOn(component.submitUser, 'emit');
      component.form.patchValue({
        username: 'newuser',
        password: '',
        name: 'New User',
        email: 'newuser@example.com',
        isAdmin: false,
      });
      component.form.markAsDirty();
      component.onSubmit();
      expect(component.submitUser.emit).toHaveBeenCalledWith({
        username: 'newuser',
        name: 'New User',
        email: 'newuser@example.com',
        isAdmin: false,
        id: undefined,
      });
    });

    it('should emit closeModal when onCancel is called', () => {
      spyOn(component.closeModal, 'emit');
      component.onCancel();
      expect(component.closeModal.emit).toHaveBeenCalled();
    });
  });

  describe('when updating an existing user', () => {
    const existingUser = {
      id: '123',
      username: 'existinguser',
      name: 'Existing User',
      email: 'existing@example.com',
      isAdmin: true,
    };

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [UserFormComponent, ReactiveFormsModule],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(UserFormComponent);
      component = fixture.componentInstance;
      // For update scenario, override the getter of selectedUser to return a function that returns the existing user.
      Object.defineProperty(component, 'selectedUser', { get: () => () => existingUser });
      fixture.detectChanges();
    });

    it('should initialize the form with the existing user data', () => {
      expect(component.form.get('username')?.value).toEqual(existingUser.username);
      expect(component.form.get('name')?.value).toEqual(existingUser.name);
      expect(component.form.get('email')?.value).toEqual(existingUser.email);
      expect(component.form.get('isAdmin')?.value).toEqual(existingUser.isAdmin);
      // The password field should be empty on update.
      expect(component.form.get('password')?.value).toEqual('');
    });

    it('should emit submitUser with updated data and omit password if unchanged', () => {
      spyOn(component.submitUser, 'emit');
      component.form.patchValue({
        username: 'updateduser',
        password: '',
        name: 'Updated User',
        email: 'updated@example.com',
        isAdmin: false,
      });
      component.form.markAsDirty();
      component.onSubmit();
      expect(component.submitUser.emit).toHaveBeenCalledWith({
        username: 'updateduser',
        name: 'Updated User',
        email: 'updated@example.com',
        isAdmin: false,
        id: existingUser.id,
      });
    });

    it('should include password in the payload if it is changed', () => {
      spyOn(component.submitUser, 'emit');
      component.form.patchValue({
        username: 'updateduser',
        password: 'newpassword',
        name: 'Updated User',
        email: 'updated@example.com',
        isAdmin: false,
      });
      component.form.markAsDirty();
      component.onSubmit();
      expect(component.submitUser.emit).toHaveBeenCalledWith({
        username: 'updateduser',
        password: 'newpassword',
        name: 'Updated User',
        email: 'updated@example.com',
        isAdmin: false,
        id: existingUser.id,
      });
    });
  });
});
