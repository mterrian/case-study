import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from "@angular/forms"


import { UserFormComponent } from './user-form.component';
import { User } from 'src/shared/User';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;

  let mockUser: User

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserFormComponent ],
      imports: [MatSnackBarModule, FormsModule, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserFormComponent);
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
    component.currentUser = mockUser
    fixture.detectChanges()
    expect(component).toBeTruthy();
  });

  it('should validate email address format', () => {
    let badEmail = component.validateEmail('not a real email')
    expect(badEmail).toEqual(false)
    let goodEmail = component.validateEmail('real@email.com')
    expect(goodEmail).toEqual(true)
  })
  it('should open snackbar when email is invalid', () => {
    let badEmailUser: User = {
      id: 1,
      username: "mock_user",
      firstName: "test",
      lastName: "user",
      email: "invalid email",
      userStatus: "T",
      department: "QA"
    }
    component.currentUser = badEmailUser
    fixture.detectChanges()
    spyOn(component, 'openSnackBar')
    component.saveUser(badEmailUser)
    expect(component.openSnackBar).toHaveBeenCalled()
  })
});
