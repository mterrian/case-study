package controllers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"

	models "userApi/models"

	sq "github.com/Masterminds/squirrel"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

type response struct {
	ID      int64  `json:"id,omitempty"`
	Message string `json:"message,omitempty"`
}

func createConnection() *sql.DB {
	err := godotenv.Load(".env")

	if err != nil {
		log.Fatalf("error loading .env file")
	}

	db, err := sql.Open("postgres", os.Getenv("POSTGRES_CONNSTR"))

	if err != nil {
		panic(err)
	}

	err = db.Ping()

	if err != nil {
		panic(err)
	}

	fmt.Println("Successfully connected!")

	return db
}

func CreateUser(w http.ResponseWriter, r *http.Request) {
	var user models.User

	err := json.NewDecoder(r.Body).Decode(&user)

	if err != nil {
		log.Fatalf("Unable to decode request body. %v", err)
	}

	userExists := checkUsername(user.Username)

	if userExists {

		res := response{
			Message: "Username exists, please select a different username",
		}

		json.NewEncoder(w).Encode(res)

	} else {

		insertID := createUserHelper(user)

		res := response{
			ID:      insertID,
			Message: "User created successfully",
		}

		json.NewEncoder(w).Encode(res)
	}
}

func GetUser(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)

	id, err := strconv.Atoi(params["id"])

	if err != nil {
		log.Fatalf("string conversion failed %v", err)
	}

	user, err := getUserHelper(int64(id))

	if err != nil {
		log.Fatalf("Unable to get user. %v", err)
	}

	json.NewEncoder(w).Encode(user)
}

func GetUsers(w http.ResponseWriter, r *http.Request) {
	users, err := getUsersHelper()

	if err != nil {
		log.Fatalf("Unable to retrieve list of Users, %v", err)
	}

	json.NewEncoder(w).Encode(users)
}

func UpdateUser(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)

	id, err := strconv.Atoi(params["id"])

	if err != nil {
		log.Fatalf("unable to convert string into int, %v", err)
	}
	var user models.User

	err = json.NewDecoder(r.Body).Decode(&user)

	if err != nil {
		log.Fatalf("Unable to decode the request body, %v", err)
	}

	userExists := checkUsername(user.Username)

	if userExists {

		res := response{
			Message: "Username exists, please select a different username",
		}

		json.NewEncoder(w).Encode(res)

	} else {

		updatedRows := updateUserHelper(int64(id), user)

		msg := fmt.Sprintf("User updated successfully. total records affected: %v", updatedRows)

		res := response{
			ID:      int64(id),
			Message: msg,
		}

		json.NewEncoder(w).Encode(res)
	}
}

func DeleteUser(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)

	id, err := strconv.Atoi(params["id"])

	if err != nil {
		log.Fatalf("Unable to convert string into int, %v", err)
	}

	deletedRows := deleteUserHelper(int64(id))

	msg := fmt.Sprintf("User deleted successfully, Total records affected: %v", deletedRows)

	res := response{
		ID:      int64(id),
		Message: msg,
	}

	json.NewEncoder(w).Encode(res)
}

//pg helper fns

func checkUsername(name string) bool {
	db := createConnection()

	defer db.Close()

	query := sq.
		Select("*").
		From("userdb").
		Where("user_name = $1", name).
		PlaceholderFormat(sq.Dollar)

	rows, err := query.RunWith(db).Query()

	if err != nil {
		log.Fatal("query failed", err)
	}

	if rows.Next() {
		return true
	} else {
		return false
	}
}

func createUserHelper(user models.User) int64 {
	db := createConnection()

	defer db.Close()

	insert := sq.
		Insert("userdb").
		Columns("user_name", "first_name", "last_name", "email", "user_status", "department").
		Values(user.Username, user.FirstName, user.LastName, user.Email, user.UserStatus, user.Department).
		Suffix("RETURNING \"userid\"").
		PlaceholderFormat(sq.Dollar)

	var id int64

	err := insert.RunWith(db).QueryRow().Scan(&id)

	if err != nil {
		log.Fatalf("Unable to execute query. %v", err)
	}

	fmt.Printf("Inserted a single record. userid: %v", id)

	return id
}

func getUserHelper(id int64) (models.User, error) {
	db := createConnection()

	defer db.Close()

	var user models.User

	query := sq.
		Select("*").
		From("userdb").
		Where("userid = $1", id).
		PlaceholderFormat(sq.Dollar)

	rows, err := query.RunWith(db).Query()

	if err != nil {
		log.Fatalf("failed to select, %v", err)
	}

	defer rows.Close()
	for rows.Next() {
		err := rows.Scan(&user.Username, &user.FirstName, &user.LastName, &user.Email, &user.UserStatus, &user.Department, &user.Id)
		if err != nil {
			log.Fatalf("Unable to scan the row. %v", err)
		}
	}
	return user, err
}

func getUsersHelper() ([]models.User, error) {
	db := createConnection()

	defer db.Close()

	var users []models.User

	query := sq.
		Select("*").
		From("userdb")

	rows, err := query.RunWith(db).Query()

	if err != nil {
		log.Fatalf("failed to select, %v", err)
	}

	defer rows.Close()

	for rows.Next() {
		var user models.User

		err = rows.Scan(&user.Username, &user.FirstName, &user.LastName, &user.Email, &user.UserStatus, &user.Department, &user.Id)

		if err != nil {
			log.Fatalf("unable to scan row, %v", err)
		}
		users = append(users, user)
	}
	return users, err
}

func updateUserHelper(id int64, user models.User) int64 {
	db := createConnection()

	defer db.Close()

	sqlStatement := `UPDATE userdb SET user_name=$2, first_name=$3, last_name=$4, email=$5, user_status=$6, department=$7 WHERE userid=$1`

	res, err := db.Exec(sqlStatement, id, user.Username, user.FirstName, user.LastName, user.Email, user.UserStatus, user.Department)

	// update := sq.
	// 	Update("userdb").
	// 	Set("user_name", user.Username).
	// 	Set("first_name", user.FirstName).
	// 	Set("last_name", user.LastName).
	// 	Set("email", user.Email).
	// 	Set("user_status", user.UserStatus).
	// 	Set("department", user.Department).
	// 	Where("userid = $1", id).
	// 	PlaceholderFormat(sq.Dollar)

	// res, err := update.RunWith(db).Query()

	if err != nil {
		log.Fatalf("unable to execute update statement, %v", err)
	}

	rowsAffected, err := res.RowsAffected()

	if err != nil {
		log.Fatalf("error while checking affected rows, %v", err)
	}

	fmt.Printf("total records affected: %v", rowsAffected)

	return rowsAffected
}

func deleteUserHelper(id int64) int64 {
	db := createConnection()

	defer db.Close()

	sqlStatement := `DELETE FROM userdb WHERE userid=$1`

	res, err := db.Exec(sqlStatement, id)

	if err != nil {
		log.Fatalf("Unable to execute query, %v", err)
	}

	rowsAffected, err := res.RowsAffected()

	if err != nil {
		log.Fatalf("Error while checking affected rows, %v", err)
	}

	fmt.Printf("Total records affected: %v", rowsAffected)

	return rowsAffected
}
