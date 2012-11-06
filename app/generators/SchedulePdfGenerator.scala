package generators

import play.api._
import play.api.mvc._
import play.i18n.Lang
import play.api.libs.json._
import scala.io.Source
import java.io.File
import java.security.MessageDigest


case class Paper(id: String, title: String, authors: String, pdf: String, date: String, room: String) {
	def getId: String = this.id
	def getTitle: String = this.title
	def getAuthors: String = this.authors
	def getPdf: String = this.pdf
	def getDate: String = this.date
	def getRoom: String = this.room
	
	def setId(newId: String): Paper = Paper(newId, title, authors, pdf, date, room)
	def setTitle(newTitle: String): Paper = Paper(id, newTitle, authors, pdf, date, room)
	def setAuthors(newAuthors: String): Paper = Paper(id, title, newAuthors, pdf, date, room)
	def setPdf(newPdf: String): Paper = Paper(id, title, authors, newPdf, date, room)
	def setDate(newDate: String): Paper = Paper(id, title, authors, pdf, newDate, room)
	def setRoom(newRoom: String): Paper = Paper(id, title, authors, pdf, date, newRoom)
}

object PaperCreator {
	def createPaper(json: JsValue): Paper = {
		Paper((json \ "id").toString, (json \ "title").toString.drop(1).dropRight(1), (json \ "authors").toString.drop(1).dropRight(1), (json \ "pdf").toString.drop(1).dropRight(1), (json \ "date").toString.drop(1).dropRight(1), (json \ "room").toString.drop(1).dropRight(1))
	}
}

object SchedulePdfGenerator {
	def apply(selectedPapers: List[String], abstractVal: Int): String = {
		val json: JsValue = Json.parse(Source.fromFile("public/js/data.json").mkString)
		val nodes = (json \\ "nodes").head
		
		// Dividing to get seconds in place of milliseconds
		//date_default_timezone_set ( "UTC" );
		val papers = changeDate(getPapers(nodes, selectedPapers))
		
		
		// Get Temporary directory
		val postfix = md5(Math.random.toInt.toString).substring(0,7)
		val directory = "public/tex/temp/" + postfix
		(new File(directory)).mkdir
		
		val tempContent	= createSchedule(abstractVal, papers, directory)
		val tempOutput	= directory + "/isit_schedule"

		// Create system call for generating pdf
		val call = "cat public/tex/header.tex " + tempContent + " public/tex/footer.tex | pdflatex --jobname " + tempOutput

		/*
		// Make system call
		$ret = exec($call);

		// Create temporary page "your download should appear in a moment. If not click here"
		echo page_output($temp_output);

		// Redirect to schedule
		header( 'Location: '.$temp_output.'.pdf' ) ;
*/	""
	}
	
	private def md5(s: String): String = {
		var algorithm = MessageDigest.getInstance("MD5")
		algorithm.update(s.getBytes)
		algorithm.digest.toString
	}

	private def changeDate(papers: List[Paper]): List[Paper] = {
		def changeDate0(papers: List[Paper], accu: List[Paper]): List[Paper] = papers match {
			case List() => accu
			case x::xs => changeDate0(xs, x.setDate(x.getDate.dropRight(3)) :: accu)
		}
		
		changeDate0(papers, List()).reverse
	}
	
	/**
	 * Creates the content part of the schedule file
	 */
	private def createSchedule(abstractVal: Int, papers: List[Paper], directory: String): String = {

		// Sorts papers by date
		//uasort($papers, "sort_by_date");
		
		// Schedule and date
		var schedule	= ""
		var date		= ""
		var time		= ""
		var first		= true

		// Now for each paper, write it out
		papers.foreach (p => {
			// Check if the date is the same as before
			val newDate 	 = ""//date('l \t\h\e jS \of F Y', p.getDate)
			val newTime 	 = ""//date('h:i A', p.getDate)

			// Add day
			if (!newDate.equals(date)) {
				if (!first) schedule = schedule + endList
				
				schedule = schedule + addScheduleDay(newDate) + startList
				first	   = false
			}

			// Add schedule point
			schedule = 	if (newTime.equals(time)) schedule + addSchedulePoint(abstractVal, p, "")
						else schedule + addSchedulePoint(abstractVal, p, newTime)

			// Add schedule point and update date
			date		= newDate
			time		= newTime
			}
		)

		// Save schedule to file
		val file = directory + "/content.tex"
		val fileObj = new File(file)
		fileObj.createNewFile
		val p = new java.io.PrintWriter(fileObj)

		p.print(schedule)
		p.close

		file
	}

	/**
	 * Constructs the latex code for a single paper in the schedule
	 */
	private def addSchedulePoint(abstractVal:Int, p: Paper, time: String): String = {
		
		// Get abstract
		var abstr = ""
		if (abstractVal == 1) {
			abstr	= TaskProcessGenerator.apply("abstract", p.getPdf)
			abstr   = latexSpecialChars(abstr)
			abstr	= "{\\small " + abstr + "} \n"
		}

		// Get title
		val title	= "{\\it " + latexSpecialChars( p.getTitle/*, "\\'\"&\n\r{}[]"*/ ) + "} \\\\ \n";

		// Get time and place
		val point = if (time.equals("")) "\\item[{\\hfill " + p.getRoom + "}]\n"
					else "\\item[{\\hfill \bf " + time + "} \\\\ {\\hfill " + p.getRoom + "}]\n"

		// Get authors
		val authors = "{" + p.getAuthors + "} \\\\ \n"

		point + title + authors + abstr + "\n"
	}

	private def startList: String = {
		"%\n%\n\\begin{enumerate}[leftmargin=5cm, labelsep=0.3cm, rightmargin=2cm, align=right, itemsep=1cm, style=multiline]\n%\n"
	}

	private def endList: String = {
		"\\end{enumerate}\n%\n"
	}
	
	/**
	 * Constructs the latex code for a page dedicated to a certain day
	 */
	private def addScheduleDay(date: String) {
		"\\clearpage\\period{" + date + "}\\hfil\\break \\\\ \n"
	}
	
	/**
	 * Sorts two items based on their date
	 */ 
	private def sortByDate(a: Paper, b: Paper): Int = {
		return if(a.getDate < b.getDate) -1 else 1 
	}


	/**
	 * Displays a field for downloading the schedule
	 */
	private def pageOutput(tempOutput: String): String = {
		"<head><title>TrailHead</title></head><body><p>If your download didn't start automatically, click <a href=\"" + tempOutput + ".pdf\" title=\"Schedule as PDF\">here</a></p></body>"
	}

	private def latexSpecialChars( str: String ): String = {
		val map = Map( 
				"#"->"\\#",
				"$"->"\\$",
				"%"->"\\%",
				"&"->"\\&",
				"~"->"\\~{}",
				"_"->"\\_",
				"^"->"\\^{}",
				"\\"->"\\textbackslash",
				"{"->"\\{",
				"}"->"\\}"
		)
		return """([\^\%~\\\\#\$%&_\{\}])""".r.replaceAllIn(str, m => map(m.group(1)))
	}
	
	private def getPapers(array: JsValue, selectedPapers: List[String]): List[Paper] = {
		var output: List[Paper] = List[Paper]()
		
		selectedPapers.foreach((id: String) => {
			val paper = PaperCreator.createPaper(array.apply(id.toInt))
			output = paper.setId(id) :: output
		})
		
		output.reverse
	}
}