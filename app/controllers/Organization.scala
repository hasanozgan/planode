package controllers

import com.codahale.jerkson.Json
import play.api.libs.json.{JsObject, JsValue}
import models.Account.Role
import play.api.mvc.{Results, Controller}


object Organization extends Controller with Secured {

  def settings = TODO

  def list = IsAuthenticated { user => request =>
    val organizationList = models.Organization.findAllByAccountId(user.toLong);
    Ok(Json.generate(organizationList)).as("application/json")
  }

  def delete(organization_id: Long) = IsAdminOf(organization_id) { user => request =>
    models.Organization.deleteById(organization_id)
    Ok
  }

  def update = IsAuthenticated { user => request =>

    var props:Map[String, JsValue] = Map[String, JsValue]()
    request.body.asJson match {
      case None => {}
      case Some(x) => {
        x match {
          case JsObject(fields) => { props = fields.toMap }
          case _ => {} // Ok("received something else: " + request.body + '\n')
        }
      }
    }

    val id = props.get("id") match {
      case None => 0
      case Some(x) => {
        x.as[Long]
      }
    }

    val name = props.get("name") match {
      case None => ""
      case Some(x) => {
        x.as[String]
      }
    }

    if (models.Organization.isAdmin(user.toLong, id)) {
      val organization = models.Organization.updateById(id, name);
      Ok(Json.generate(organization)).as("application/json")
    } else {
      Forbidden
    }
  }

  def add = IsAuthenticated { user => request =>
    var props:Map[String, JsValue] = Map[String, JsValue]()
    request.body.asJson match {
      case None => {}
      case Some(x) => {
        x match {
          case JsObject(fields) => { props = fields.toMap }
          case _ => {} // Ok("received something else: " + request.body + '\n')
        }
      }
    }

    val name = props.get("name") match {
      case None => ""
      case Some(x) => {
        x.asOpt[String].get
      }
    }
    val organization = models.Organization.create(name);
    models.Organization.addMember(user.toLong, organization.get.id, Role.Owner)
    Ok(Json.generate(organization)).as("application/json")
  }
}
