package models

import play.api.db._
import play.api.Play.current

import anorm._
import anorm.SqlParser._

case class Account(id: Long, email: String, fullname: String, password: String)

object Account {

  object Role extends Enumeration {
    type Role = Int

    val Owner = 1
    val Admin = 2
    val Member = 3
    val Guest = 4
  }

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
  def create(fullname: String, email: String, password: String): Option[Account] = {
    DB.withConnection {
      implicit connection =>
        SQL(
          """
          insert into acl_user(email, fullname, password, created_at, updated_at) values (
            {email}, {fullname}, {password}, now(), now()
          )
          """
        ).on(
          'email -> email,
          'fullname -> fullname,
          'password -> password
        ).executeInsert()

        findByEmail(email)
    }
  }


  def update(id:Long, fullname: String, email: String, password: String): Option[Account] = {
    DB.withConnection {
      implicit connection =>

        if (password.length == 32) {
          SQL(
            """
              update acl_user set email={email}, fullname={fullname}, password={password}, updated_at=now()
              where id_acl_user={id}
            """
          ).on(
            'id -> id,
            'fullname -> fullname,
            'email -> email,
            'password -> password
          ).executeUpdate()
        }
        else {
          SQL(
            """
              update acl_user set email={email}, fullname={fullname}, updated_at=now()
              where id_acl_user={id}
            """
          ).on(
            'id -> id,
            'fullname -> fullname,
            'email -> email
          ).executeUpdate()
        }

        findByEmail(email)
    }
  }

}
