package users

type User struct {
	Id         int64  `json:"id"`
	Username   string `json:"username"`
	FirstName  string `json:"firstName"`
	LastName   string `json:"lastName"`
	Email      string `json:"email"`
	UserStatus string `json:"userStatus"`
	Department string `json:"department"`
}
