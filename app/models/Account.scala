package models

import play.api.db._
import play.api.Play.current

import anorm._
import anorm.SqlParser._

case class Account(id: Long, email: String, fullname: String, password: String)

object Account {

  // -- Parsers

  /**
   * Parse a User from a ResultSet
   */
  val simple = {
    get[Long]("acl_user.id_acl_user") ~
    get[String]("acl_user.email") ~
    get[String]("acl_user.fullname") ~
    get[String]("acl_user.password") map {
      case id ~ email ~ fullname ~ password => Account(id, email, fullname, password)
    }
  }

  // -- Queries

  /**
   * Retrieve a User from email.
   */
  def findByEmail(email: String): Option[Account] = {
    DB.withConnection {
      implicit connection =>
        SQL("select * from acl_user where email = {email} and status='active'").on(
          'email -> email
        ).as(Account.simple.singleOpt)
    }
  }

  def findById(id: Long): Option[Account] = {
    DB.withConnection {
      implicit connection =>
        SQL("""
          select * from acl_user
                where id_acl_user = {id} and status='active'
            """).on(
          'id -> id
        ).as(Account.simple.singleOpt)
    }
  }


  /**
   * Retrieve all users.
   */
  def findAll: Seq[Account] = {
    DB.withConnection {
      implicit connection =>
        SQL("select * from user").as(Account.simple *)
    }
  }

  /**
   * Authenticate a User.
   */
  def authenticate(email: String, password: String): Option[Account] = {
    DB.withConnection {
      implicit connection =>
        SQL(
          """
         select * from acl_user where
         email = {email} and password = {password} and
         status='active'
          """
        ).on(
          'email -> email,
          'password -> password
        ).as(Account.simple.singleOpt)
    }
  }

  /**
   * Create a User.
   */
  def create(account: Account): Account = {
    DB.withConnection {
      implicit connection =>

        SQL(
          """
          insert into user values (
            {email}, {fullname}, {password}
          )
          """
        ).on(
          'email -> account.email,
          'fullname -> account.fullname,
          'password -> account.password
        ).executeInsert()

        account

    }
  }

}
