package controllers

import play.api._
import i18n.{Lang, Messages}
import play.api.mvc._
import java.util.Locale

object Application extends Controller {

  def index = Action { request =>
    Ok(views.html.index((Lang.defaultLang).toString() + Messages("application.index.hello")(Lang.defaultLang)))
  }

}

trait Secured {
  /**
   * Retrieve the connected user email.
   */
  private def account_id(request: RequestHeader) = request.session.get("user")

  /**
   * Redirect to login if the user in not authorized.
   */
  private def onUnauthorized(request: RequestHeader) = Results.Forbidden("HATA")

  // --

  /**
   * Action for authenticated users.
   */
  def IsAuthenticated(f: => String => Request[AnyContent] => Result) = Security.Authenticated(account_id, onUnauthorized)
  {
    user => Action(request => f(user)(request))
  }

  /**
   * Check if the connected user is a member of this project.
   */

  def IsAdminOf(organization_id: Long)(f: => String => Request[AnyContent] => Result) = IsAuthenticated { account_id => request =>

    if(models.Organization.isAdmin(account_id.toLong, organization_id)) {
      f(account_id)(request)
    } else {
      Results.Forbidden
    }
  }

  /**
   * Check if the connected user is a owner of this task.
   */
  /*
  def IsOwnerOf(task: Long)(f: => String => Request[AnyContent] => Result) = IsAuthenticated { user => request =>
    if(Task.isOwner(task, user)) {
      f(user)(request)
    } else {
      Results.Forbidden
    }
  }
  */

}