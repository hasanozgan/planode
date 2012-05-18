package models

import play.api.db._
import play.api.Play.current

import anorm._
import anorm.SqlParser._

case class Organization(id: Long, name: String)




object Organization {


  /**
   * Parse a User from a ResultSet
   */
  val simple = {
      get[Long]("organization.id_organization") ~ get[String]("organization.name") map {
          case organization_id ~ organization_name =>
               Organization(organization_id, organization_name)
      }
  }

  def addMember(account_id: Long, organization_id: Long, role_id: Int) {
    DB.withConnection {
      implicit connection =>
        SQL("""
              INSERT INTO organization_member(fk_acl_user, fk_organization, fk_acl_role, created_at, updated_at) values({account_id}, {organization_id}, {role_id}, now(), now());
            """).on(
          'account_id -> account_id,
          'organization_id -> organization_id,
          'role_id -> role_id
        ).executeInsert() match {
          case Some(id:Long) => findById(id)
        }
    }
  }

  def create(name: String): Option[Organization] = {
    DB.withConnection {
      implicit connection =>
        SQL("""
              INSERT INTO organization(name, status, created_at, updated_at) values({name}, 'active', now(), now());

            """).on(
          'name -> name
        ).executeInsert() match {
          case Some(id:Long) => findById(id)
        }
    }
  }

  def findById(id: Long): Option[Organization] = {
    DB.withConnection {
      implicit connection =>
        SQL("""
          SELECT o.id_organization, o.name FROM `organization` o
            WHERE o.id_organization = {id} AND o.status = 'active'
            """).on(
          'id -> id
        ).as(Organization.simple.singleOpt)
    }
  }

  def isAdmin(account_id: Long, organization_id: Long): Boolean = {
    DB.withConnection {
      implicit connection =>
        SQL("""
          SELECT DISTINCT o.id_organization, o.name FROM `organization_member` om
            LEFT JOIN `organization` o ON om.fk_organization = o.id_organization
            LEFT JOIN `acl_role` ar ON ar.id_acl_role = om.fk_acl_role
            LEFT JOIN `acl_user` au ON au.id_acl_user = om.fk_acl_user
          WHERE om.fk_acl_user = {account_id} AND om.fk_organization={organization_id} AND
            ar.name IN ("admin", "owner") AND om.status = 'active' AND
            o.status = 'active' AND au.status = 'active'
            """).on(
          'account_id -> account_id,
          'organization_id -> organization_id
        ).as(Organization.simple.singleOpt) match {
          case Some(org) => true
          case None => false;
        }
    }
  }

  def updateById(id: Long, name: String): Option[Organization] = {
    DB.withConnection {
      implicit connection =>
        SQL("""
          UPDATE `organization` o SET o.name = {name}
            WHERE o.id_organization = {id}
            """).on(
          'name -> name,
          'id -> id
        ).executeUpdate()

        findById(id)
    }
  }


  def deleteById(id: Long) = {
    DB.withConnection {
      implicit connection =>
        SQL("""
          UPDATE `organization` o SET o.status = 'deleted'
            WHERE o.id_organization = {id}
            """).on(
          'id -> id
        ).executeUpdate();
    }
  }


  def findAllByAccountId(id: Long): Seq[Organization] = {
    DB.withConnection {
      implicit connection =>
        SQL("""
          SELECT DISTINCT o.id_organization, o.name FROM `organization_member` om
            LEFT JOIN `organization` o ON om.fk_organization = o.id_organization
            LEFT JOIN `acl_role` ar ON ar.id_acl_role = om.fk_acl_role
            LEFT JOIN `acl_user` au ON au.id_acl_user = om.fk_acl_user
          WHERE om.fk_acl_user = {id} AND ar.name IN ("admin", "owner") AND
            om.status = 'active' AND o.status = 'active' AND au.status = 'active'
            """).on(
          'id -> id
        ).as(Organization.simple *)
    }
  }
}