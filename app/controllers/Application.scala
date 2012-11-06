package controllers

import play.api._
import play.api.mvc._
import java.io.File
import paper.Analyze
import generators._

object Application extends Controller { 
  
  def index = Action {
    Ok(views.html.index(""))
  }
  
  def generateSchedulePdf = Action { request =>
	val body = request.body.asFormUrlEncoded
	if(body != None) {
		val papers = body.get("papers[]").toList
		val abstractGet = body.get("abstract")
		
		val abstractVal = if(abstractGet.length == 1) abstractGet.toList.head.toInt else 0
		
		Ok(SchedulePdfGenerator.apply(papers, abstractVal))
	} else Ok("Something went wrong")
  }
  
  def generateTaskProcess(task: String, path: String) = Action {
	Ok(TaskProcessGenerator.apply(task, utf8URLDecode(path)))
  }
  
  def generatePersonalGraph(link: String) = Action {
	Ok(views.html.index(link))
  }
  
  def generateLink = Action { request =>
	val body = request.body.asFormUrlEncoded
	if(body != None) {
		val email = body.get("useremail").toList
	}
	// TODO
	Redirect(routes.Application.index)
  }
  
  def getGraphData(link: String) = Action {
	Ok("")	// TODO
  }
  
  private def utf8URLDecode(url: String): String = {
	return """/%u([0-9a-f]{3,4})/i""".r.replaceAllIn(java.net.URLDecoder.decode(url.replace("\\00", "%u00"), "UTF-8"), "&#x\\1;")
  }
}