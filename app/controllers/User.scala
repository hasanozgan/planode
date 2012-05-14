package controllers

import play.api.mvc.{Action, Controller}
import play.api.i18n.Messages

object User extends Controller with Secured
{
  def calendar = IsAuthenticated { user => request =>
    Ok("Languages: " + request.acceptLanguages.map(_.code).mkString(", ") )
  }

  def message = TODO

  def settings = TODO

  def categories = TODO

  def locations = TODO

  def members = TODO

  def widget = TODO
}
