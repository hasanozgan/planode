/**
 * Created with IntelliJ IDEA.
 * User: hasanozgan
 * Date: 5/4/12
 * Time: 12:18 AM
 * To change this template use File | Settings | File Templates.
 */


import java.util.Locale
import play.api._
import mvc.{Handler, RequestHeader}


// Note: this is in the default package.
object Global extends GlobalSettings {

  override def onRouteRequest(request: RequestHeader): Option[Handler] = {
    /*
    val lang = request.queryString.get("lang").getOrElse("tr")
    Locale.setDefault(new Locale(lang.toString))
    println("executed before every request:" + request.toString + "    " +lang)
    */
    super.onRouteRequest(request)
  }

}
