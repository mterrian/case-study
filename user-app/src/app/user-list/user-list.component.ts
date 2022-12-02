import { Component, OnInit } from '@angular/core';
import { User } from 'src/shared/User';
import { UserService } from 'src/shared/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.sass'],
  providers: [UserService]
})
export class UserListComponent implements OnInit {
  users!: User[];

  editUserId = 0

  newUser: User = {
    id: -1,
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    userStatus: ''
  }

  showCreateUserForm = false

  constructor(private userService: UserService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getUserList()
  }

  closeEditForm() {
    this.editUserId = 0
    this.showCreateUserForm = false
    this.getUserList()
  }

  openCreateUserForm() {
    this.editUserId = 0
    this.showCreateUserForm = true
    this.getUserList()
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'dismiss')
  }

  getUser(user: User): void {
    this.userService.getUser(user).subscribe((user: User) => {
      this.editUserId = user.id
      this.showCreateUserForm = false
    })
  }

  getUserList() {
    this.userService.getUsers().subscribe((users: User[]) => {
      this.users = users
    })
  }

  createUser(user: User): void {
    let { id: _, ...newUser} = user
    this.userService.createUser(newUser).subscribe((res: any) => {
      let { message } = res
      this.openSnackBar(message)
      if(res.id) {
        this.closeEditForm()
      }
    })
  }

  deleteUser(user: User) {
    this.userService.deleteUser(user).subscribe(res => {
      console.log(res)
      this.getUserList()
    })
  }

  updateUser(user: User) {
    this.userService.updateUser(user).subscribe((res: any) => {
      let { message } = res
      this.getUserList()
      if(res.id) {
        this.closeEditForm()
      } else {
        this.openSnackBar(message)
      }
    })
  }

}
