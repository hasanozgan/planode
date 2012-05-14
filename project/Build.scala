import sbt._
import Keys._
import PlayProject._

object ApplicationBuild extends Build {

    val appName         = "planode"
    val appVersion      = "1.0-SNAPSHOT"

    val appDependencies = Seq(
        "mysql" % "mysql-connector-java" % "5.1.18",
        "be.objectify" %% "deadbolt-2" % "1.1.3-SNAPSHOT"
    )

    val main = PlayProject(appName, appVersion, appDependencies, mainLang = SCALA).settings(
        // Change this to point to your local play repository
        resolvers += Resolver.url("Objectify Play Repository", url("http://schaloner.github.com/releases/"))(Resolver.ivyStylePatterns),
        resolvers += Resolver.url("Objectify Play Repository", url("http://schaloner.github.com/snapshots/"))(Resolver.ivyStylePatterns)
    )

}
