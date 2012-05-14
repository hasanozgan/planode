package controllers

import play.api.mvc.Results._
import play.api.i18n.Messages
import play.api.mvc.{Action, Controller}
import play.api.mvc._
import com.codahale.jerkson.Json

import models._
import java.security.MessageDigest

/**
 * Created with IntelliJ IDEA.
 * User: hasanozgan
 * Date: 4/29/12
 * Time: 7:12 PM
 * To change this template use File | Settings | File Templates.
 */

object Auth extends Controller {

  def signup = Action(parse.json) { request =>
    (request.body \ "email").asOpt[String].map { email =>
      Ok(Json.generate(
        Map("status" -> "OK", "message" -> ("Hello " + email))
      ))
    }.getOrElse {
      BadRequest(Json.generate(
        Map("status" -> "KO", "message" -> "Missing parameter [name]")
      ))
    }
  }

  def login = Action(parse.json) { request =>
    //User.create()
    var email = (request.body \ "email").asOpt[String].get;
    var password = (request.body \ "password").asOpt[String].get;

    val result = models.Account.authenticate(email, password);
    if (result.isDefined) {
      val json = Json.generate(result)
      Ok(json).as("application/json").withSession("user" -> result.get.id.toString)
    }
    else {
      val json = Json.generate(Map("__alert__" -> "Hatalı kullanıcı adı veya parola"))

      BadRequest(json).as("application/json");
    }
  }

  def md5SumString(bytes : Array[Byte]) : String = {
    val md5 = MessageDigest.getInstance("MD5")
    md5.reset()
    md5.update(bytes)

    md5.digest().map(0xFF & _).map { "%02x".format(_) }.foldLeft(""){_ + _}
  }

  def check = Action { request =>
    if (request.session.get("user").isDefined) {
      val account_id = request.session.get("user").get.toLong;
      val result = models.Organization.findAllByAccountId(account_id);
      val json = Json.generate(result)
      Ok(json).as("application/json")
    }
    else {
      val json = Json.generate(Map("__alert__" -> "Hatalı kullanıcı adı veya parola"))
      BadRequest(json).as("application/json");
    }
  }

  def logout = Action { request =>
    Ok(Json.generate(Map("status" -> "OK"))).withNewSession
  }

}
