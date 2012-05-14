package models

import play.api.db._
import play.api.Play.current

import anorm._
import anorm.SqlParser._

case class Organization(organization_id: Long, organization_name: String,
                        organization_location_id: Long, organization_location_name: String,
                        organization_category_id: Long, organization_category_name: String, role_name: String)


object Organization {

  /**
   * Parse a User from a ResultSet
   */
  val simple = {
      get[Long]("organization.id_organization") ~ get[String]("organization.name") ~
      get[Long]("organization_location.id_organization_location") ~ get[String]("organization_location.name") ~
      get[Long]("organization_category.id_organization_category") ~ get[String]("organization_category.name") ~
      get[String]("acl_role.name") map {
          case organization_id ~ organization_name ~
               organization_location_id ~ organization_location_name ~
               organization_category_id ~ organization_category_name ~ role_name =>
               Organization(organization_id, organization_name,
                            organization_location_id, organization_location_name,
                            organization_category_id, organization_category_name, role_name)
      }
  }

  def findAllByAccountId(id: Long): Seq[Organization] = {
    DB.withConnection {
      implicit connection =>
        SQL("""
          SELECT o.id_organization, o.name,
                 ol.id_organization_location, ol.name,
                 oc.id_organization_category, oc.name, ar.name
          FROM `organization_member` om
            LEFT JOIN `organization` o ON om.fk_organization = o.id_organization
            LEFT JOIN `organization_location` ol ON ol.fk_organization = o.id_organization
            LEFT JOIN `organization_category` oc ON oc.fk_organization = o.id_organization
            LEFT JOIN `acl_role` ar ON ar.id_acl_role = om.fk_acl_role
            LEFT JOIN `acl_user` au ON au.id_acl_user = om.fk_acl_user
          WHERE au.id_acl_user = {id} AND ar.name IN ("admin", "member") AND
            om.status = 'active' AND o.status = 'active' AND ol.status = 'active' AND
            oc.status = 'active' AND au.status = 'active'
            """).on(
          'id -> id
        ).as(Organization.simple *)
    }
  }
}