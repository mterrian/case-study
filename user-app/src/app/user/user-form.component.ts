import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { User } from 'src/shared/User';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.sass']
})
export class UserFormComponent implements OnInit {
  @Input() currentUser: any
  @Output() valueChange: EventEmitter<any> = new EventEmitter()

  @Output() userUpdatePayload: EventEmitter<any> = new EventEmitter()
  @Output() userDeletePayload: EventEmitter<any> = new EventEmitter()
  @Output () cancelNewUser: EventEmitter<any> = new EventEmitter()


  constructor(
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
   
   
  }

  validateEmail(email: string) {
    let re = new RegExp("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
    if (re.test(email)) {
      return true
    } else return false
  }
  
  openSnackBar(message: string) {
    this.snackBar.open(message, 'dismiss')
  }

  saveUser(user: User) {
    let emailValid = this.validateEmail(user.email)
    if(emailValid) {
      this.valueChange.emit(this.currentUser)
      this.userUpdatePayload.emit(user)
    } else this.openSnackBar('please enter a valid email address')
  }

  deleteUser(user: User) {
    this.valueChange.emit(this.currentUser)
    this.userDeletePayload.emit(user)
  }

  cancelCreateUser() {
    this.cancelNewUser.emit()
  }

}
