package controllers

import play.api.mvc._
import play.api.mvc.{Action, Controller}
import play.api.i18n.Messages
import com.codahale.jerkson.Json
import play.api.libs.json.{JsObject, JsValue}

object Account extends Controller with Secured
{
  def update = IsAuthenticated { user => request =>

    var errors:Map[String, String] = Map[String, String]()

    val currentAccount = models.Account.findById(user.toLong)
    var account: Option[models.Account] = None

    if (currentAccount.isDefined) {

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

      val fullname = props.get("fullname") match {
        case None => ""
        case Some(x) => {
          x.asOpt[String].get
        }
      }
      val email = props.get("email") match {
        case None => ""
        case Some(x) => {
          x.asOpt[String].get
        }
      }
      val password = props.get("password") match {
        case None => ""
        case Some(x) => {
          x.asOpt[String].get
        }
      }

      if (currentAccount.get.email != email) {
        val result = models.Account.findByEmail(email)

        if (result.isDefined) {
          errors = Map("email" -> "Bu eposta adresi daha önce kaydedilmiş")
        }
      }

      if (errors.isEmpty) {
        account = models.Account.update(currentAccount.get.id, fullname, email, password)

        if (account.isEmpty) {
          errors = Map("email" -> "Bu eposta adresi daha önce kaydedilmiş")
        }
      }
    }
    else {
      errors = Map("__alert__" -> "Oturum zaman aşımına uğradı.")
    }

    if (errors.isEmpty) {
      val json = Json.generate(account)
      Ok(json).as("application/json").withSession("user" -> currentAccount.get.id.toString)
    }
    else {
      val json = Json.generate(errors)
      BadRequest(json).as("application/json");
    }
  }

  def message = TODO

  def settings = TODO

  def categories = TODO

  def locations = TODO

  def members = TODO

  def widget = TODO
}
