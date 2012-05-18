package controllers

import play.api.mvc.Results._
import play.api.i18n.Messages
import play.api.mvc.{Action, Controller}
import play.api.mvc._
import com.codahale.jerkson.Json

import models._
import java.security.MessageDigest
import play.api.libs.json.JsValue
import collection.mutable.HashMap

/**
 * Created with IntelliJ IDEA.
 * User: hasanozgan
 * Date: 4/29/12
 * Time: 7:12 PM
 * To change this template use File | Settings | File Templates.
 */

object Auth extends Controller with Secured {

  def signup = Action(parse.json) { request =>

    var fullname = (request.body \ "fullname").asOpt[String].get;
    var email = (request.body \ "email").asOpt[String].get;
    var password = (request.body \ "password").asOpt[String].get;

    val result = models.Account.findByEmail(email)

    if (result.isDefined) {
      val json = Json.generate(Map("email" -> "Bu eposta adresi daha önce kaydedilmiş"))
      BadRequest(json).as("application/json");
    }
    else {
      val account = models.Account.create(fullname, email, password)

      if (account.isDefined) {
        val organizations = models.Organization.findAllByAccountId(account.get.id);
        var result:HashMap[String, Object] = HashMap[String, Object]();
        result.put("account", account)
        result.put("organizations", organizations)

        Ok(Json.generate(result)).as("application/json").withSession("user" -> account.get.id.toString)
      }
      else {
        val json = Json.generate(Map("__alert__" -> "Kullanıcı kaydı alınırken bir hata oluştu."))
        BadRequest(json).as("application/json");
      }
    }
  }

  def login = Action(parse.json) { request =>

    var email = (request.body \ "email").asOpt[String].get;
    var password = (request.body \ "password").asOpt[String].get;

    val account = models.Account.authenticate(email, password);
    if (account.isDefined) {

      val organizations = models.Organization.findAllByAccountId(account.get.id);
      var result:HashMap[String, Object] = HashMap[String, Object]();
      result.put("account", account)
      result.put("organizations", organizations)

      Ok(Json.generate(result)).as("application/json").withSession("user" -> account.get.id.toString)
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

  def check = IsAuthenticated { account_id => request =>

    val account = models.Account.findById(account_id.toLong);

    if (account.isDefined) {
      val organizations = models.Organization.findAllByAccountId(account_id.toLong);
      var result:HashMap[String, Object] = HashMap[String, Object]();
      result.put("account", account)
      result.put("organizations", organizations)

      Ok(Json.generate(result)).as("application/json")
    }
    else {
      val json = Json.generate(Map("__alert__" -> "Oturum zaman aşımına uğradı."))
      BadRequest(json).as("application/json");
    }
  }

  def logout = Action { request =>
    Ok(Json.generate(Map("status" -> "OK"))).withNewSession
  }

}
