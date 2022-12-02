import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { UserListComponent } from './user-list.component';
import { User } from 'src/shared/User';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let mockUser: User

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserListComponent ],
      imports: [ MatSnackBarModule, HttpClientTestingModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;

    mockUser = {
      id: 1,
      username: "mock_user",
      firstName: "test",
      lastName: "user",
      email: "mockmanProphecies@mockmail.com",
      userStatus: "T",
      department: "QA"
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call getUserList on init', async () => {
    spyOn(component, 'getUserList')
    component.ngOnInit()
    expect(component.getUserList).toHaveBeenCalled()
  })
  it('should set userId to 0 when completing CRUD operations', async () => {
    spyOn(component, 'getUserList')
    fixture.detectChanges()
    component.ngOnInit()
    expect(component.getUserList).toHaveBeenCalled()
    expect(component.editUserId).toEqual(0)
    
    component.getUser(mockUser)
    await fixture.whenStable()
    expect(component.editUserId).toEqual(mockUser.id)
    
    component.deleteUser(mockUser)
    fixture.whenStable().then(() => {
      expect(component.editUserId).toEqual(0)
    })
  })
});
