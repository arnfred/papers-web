package generators

import play.api._
import play.api.mvc._
import play.i18n.Lang
import scala.io.Source
import java.io.File
import paper._

object TaskProcessGenerator {
	def apply(task: String, path: String): String = {
		return if(task.equals("abstract")) getAbstract(path) else "Task not recognized"
	}
	
	private def getAbstract(pdf: String): String = {		
		val array = List[(String, String)](("&ucirc;", "fi"), ("&quot;d", "&le;"), ("&iuml;&not;", "fi"), ("&acirc;‰&curren;", "&le;"), ("&ordm;", "&#954;"),
											("&acute;", "&#948;"), ("&quot;&yen;", "&#8869;"), ("&quot;H", "&#8776;"), ("&quot;", "&#9827;"), ("&sup3;", "&#947;"), ("&Aacute;", "&#961;"), 
											("&Auml;", "&#964;"), ("&raquo;", "&#955;"))
											
		
		val files = Analyze.main(Array[String]("public/" + pdf, "-p"))
		
		if(files.isEmpty) return "Can't load the abstract"
		else return replaceWithList(files.head.getAbstract.getText, array)
	}
	
	private def replaceWithList(str: String, array: List[(String, String)]): String = {
		var output = str
		
		array.foreach((l: (String, String)) => output = output.replace(l._1, l._2))
		
		output
	}
	
	private def repeatStr(str: String, nb: Int): String = {
		var output = ""
		var i = 0
		
		while(i < nb) {
			output = output + str
			i = i + 1
		}
		
		output
	}
}