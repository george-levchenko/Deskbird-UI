import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store } from '@ngrx/store';
import { ConfirmationService } from 'primeng/api';
import { loadUsers, addUser, updateUser, deleteUser } from '../../store/users/users.actions';
import { selectUsers, selectUsersLoading } from '../../store/users/users.selectors';
import { selectIsAdmin } from '../../store/auth/auth.selectors';
import { User } from '../../models/user.model';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  // Stub for the Store with spy for selectSignal and dispatch.
  let storeStub: {
    selectSignal: jasmine.Spy;
    dispatch: jasmine.Spy;
  };

  // Stub for the ConfirmationService.
  let confirmationServiceStub: {
    confirm: jasmine.Spy;
  };

  // Default stub values for selectors.
  const defaultUsers = [
    {
      id: '1',
      username: 'user1',
      name: 'User One',
      email: 'user1@example.com',
      isAdmin: false,
    },
  ];

  beforeEach(async () => {
    storeStub = {
      selectSignal: jasmine.createSpy('selectSignal').and.callFake((selector: unknown) => {
        if (selector === selectUsers) {
          return () => defaultUsers;
        }
        if (selector === selectUsersLoading) {
          return () => false;
        }
        if (selector === selectIsAdmin) {
          return () => true;
        }
        return () => null;
      }),
      dispatch: jasmine.createSpy('dispatch'),
    };

    confirmationServiceStub = {
      confirm: jasmine.createSpy('confirm'),
    };

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: Store, useValue: storeStub },
        { provide: ConfirmationService, useValue: confirmationServiceStub },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      // Ensure that any providers defined in the component are overridden.
      .overrideProvider(ConfirmationService, { useValue: confirmationServiceStub })
      .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should dispatch loadUsers on init', () => {
    expect(storeStub.dispatch).toHaveBeenCalledWith(loadUsers());
  });

  it('should open user modal and set selectedUser when a user is provided', () => {
    const testUser: User = {
      id: '1',
      username: 'user1',
      name: 'User One',
      email: 'user1@example.com',
      isAdmin: false,
    };
    component.openUserModal(testUser);
    expect(component.selectedUser()).toEqual(testUser);
    expect(component.userModalVisible()).toBeTrue();
  });

  it('should open user modal with selectedUser as null when no user is provided', () => {
    component.openUserModal();
    expect(component.selectedUser()).toBeNull();
    expect(component.userModalVisible()).toBeTrue();
  });

  it('should close the user modal and reset selectedUser', () => {
    component.openUserModal({
      id: '1',
      username: 'user1',
      name: 'User One',
      email: 'user1@example.com',
      isAdmin: false,
    });
    component.closeUserModal();
    expect(component.userModalVisible()).toBeFalse();
    expect(component.selectedUser()).toBeNull();
  });

  it('should dispatch addUser action on createUser and close the modal', () => {
    const newUser = {
      id: '2',
      username: 'user2',
      name: 'User Two',
      email: 'user2@example.com',
      isAdmin: false,
    };
    component.createUser(newUser);
    expect(storeStub.dispatch).toHaveBeenCalledWith(addUser({ user: newUser }));
    expect(component.userModalVisible()).toBeFalse();
  });

  it('should dispatch updateUser action on editUser and close the modal', () => {
    const editedUser = {
      id: '1',
      username: 'user1',
      name: 'User One Edited',
      email: 'user1@example.com',
      isAdmin: false,
    };
    component.editUser(editedUser);
    expect(storeStub.dispatch).toHaveBeenCalledWith(updateUser({ user: editedUser }));
    expect(component.userModalVisible()).toBeFalse();
  });

  it('should call confirmationService.confirm on deleteUser and dispatch deleteUser on accept callback', () => {
    const testUser = {
      id: '1',
      username: 'user1',
      name: 'User One',
      email: 'user1@example.com',
      isAdmin: false,
    };
    const fakeEvent = { target: {} } as Event;

    // Call deleteUser with the event first and then the user.
    component.deleteUser(fakeEvent, testUser);

    // Verify that the confirm method was called.
    expect(confirmationServiceStub.confirm).toHaveBeenCalled();

    // Retrieve the configuration passed to confirm.
    const config = confirmationServiceStub.confirm.calls.mostRecent().args[0];

    // Simulate the user accepting the confirmation.
    config.accept();

    // Check that the deleteUser action is dispatched with the correct id.
    expect(storeStub.dispatch).toHaveBeenCalledWith(deleteUser({ id: testUser.id }));
  });

  it('should display the "Create User" button when isAdmin is true', () => {
    fixture.detectChanges();
    const createUserButton: HTMLElement = fixture.nativeElement.querySelector('.button-add');
    expect(createUserButton).toBeTruthy();
  });

  it('should render skeleton placeholders when selectUsersLoading returns true', () => {
    storeStub.selectSignal.and.callFake((selector: unknown) => {
      if (selector === selectUsers) {
        return () => [];
      }
      if (selector === selectUsersLoading) {
        return () => true;
      }
      if (selector === selectIsAdmin) {
        return () => true;
      }
      return () => null;
    });
    // Recreate the component to pick up the new signal values.
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const skeletonElements = fixture.nativeElement.querySelectorAll('p-skeleton');
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  it('should render user rows when not loading', () => {
    fixture.detectChanges();
    const tableRows = fixture.nativeElement.querySelectorAll('.table-row');
    expect(tableRows.length).toBeGreaterThan(0);
  });
});
