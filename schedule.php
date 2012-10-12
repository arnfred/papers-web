<?php

// Get selected papers from post
$selected = $_POST["papers"];

// echo "<PRE>";
// print_r($selected);
// echo "</PRE>";

// Get json data
$source	= file_get_contents("js/data.json");
$json	= json_decode($source);

// Get list of selected papers with metadata from json
$papers	= get_papers($json->nodes, $selected);

// Dividing to get seconds in place of milliseconds
date_default_timezone_set ( "UTC" );
foreach ($papers as $p) $p->date = $p->date/1000;

// Get Temporary directory
$postfix		= substr(md5(time().rand()),0,7);
$directory		= "tex/temp/".$postfix;
mkdir($directory);
$temp_content	= create_schedule($papers, $directory);
$temp_output	= "$directory/isit_schedule";

// Create system call for generating pdf
$call	 = "cat tex/header.tex ";
$call	.= $temp_content . " ";
$call	.= "tex/footer.tex ";
$call	.= "| pdflatex --jobname ".$temp_output;

// Make system call
$ret = exec($call);
//$ret = system($call);

// Create temporary page "your download should appear in a moment. If not click here"
echo page_output($temp_output);

// Redirect to schedule
header( 'Location: '.$temp_output.'.pdf' ) ;



/**
 * Creates a list of selected papers with metadata
 */
function get_papers($json, $selected) {
	$result = array();
	// For each paper in the list
	foreach ($json as $p) {
		// For each selected paper
		foreach ($selected as $id) {
			if ($p->id == $id) $result[$id] = $p;
		}
	}
	return $result;
}


/**
 * Creates the content part of the schedule file
 */
function create_schedule($papers, $directory) {

	// Sorts papers by date
	uasort($papers, "sort_by_date");
	
	// Schedule and date
	$schedule	= "";
	$date		= "";
	$time		= "";
	$first		 = true;

	// Now for each paper, write it out
	foreach ($papers as $p) {
		// Check if the date is the same as before
		$newDate 	 = date('l \t\h\e jS \of F Y', $p->date);
		$newTime 	 = date('h:i A', $p->date);

		// Add day
		if ($newDate != $date) {
			if (!$first) $schedule .= end_list();
			$schedule .= add_schedule_day($newDate);
			$schedule .= start_list();
			$first	   = false;
		}

		// Add schedule point
		if ($newTime == $time) $schedule .= add_schedule_point($p,"");
		else				   $schedule .= add_schedule_point($p,$newTime);

		// Add schedule point and update date
		$date		= $newDate;
		$time		= $newTime;
	}

	// Save schedule to file
	$file = "$directory/content.tex";
	file_put_contents($file, $schedule);

	return $file;

}

function start_list() {
	return "%\n%\n\\begin{enumerate}[leftmargin=5cm, labelsep=0.3cm, rightmargin=2cm, align=right, itemsep=1cm, style=multiline]\n%\n";
}

function end_list() {
	return "\\end{enumerate}\n%\n";
}

/**
 * Constructs the latex code for a page dedicated to a certain day
 */
function add_schedule_day($date) {
	$page	 = "\\clearpage";
	$page	.= "\\period{".$date."}";
	$page	.= "\\hfil\\break \\\\ \n";
	return $page;
}

/**
 * Constructs the latex code for a single paper in the schedule
 */
function add_schedule_point($p, $time) {
	
	// Get abstract
	$id	 	 = $p->id;
	$abstr	 = "";
	if ($_POST["abstract"] == 1) {
		$abstr	= file_get_contents("data/".$id.".abstract.txt");
		$abstr  = latexSpecialChars(substr($abstr,9,-1));
		$abstr	= "{\\small ".$abstr."} \n";
	}

	// Get title
	$title	 = latexSpecialChars( $p->title, "\\'\"&\n\r{}[]" );
	$title	 = "{\\it ".$title."} \\\\ \n";

	// Get time and place
	if ($time == "") $point = "\\item[{\\hfill ".$p->room."}]\n";
	else			 $point = "\\item[{\\hfill \bf ".$time."} \\\\ {\\hfill ".$p->room."}]\n";

	// Get authors
	$authors = "{".$p->authors."} \\\\ \n";

	return $point.$title.$authors.$abstr."\n";
}


/**
 * Sorts two items based on their date
 */ 
function sort_by_date($a, $b) {
	return ($a->date < $b->date) ? -1 : 1; 
}


/**
 * Displays a field for downloading the schedule
 */
function page_output($temp_output) {

	$result  = "";
	$result	.= "<head><title>TrailHead</title></head>";
	$result	.= "<body><p>If your download didn't start automatically, click ";
	$result	.= "<a href=\"".$temp_output.".pdf\" title=\"Schedule as PDF\">here</a></p></body>";
	return $result;
}

function latexSpecialChars( $string ) {
    $map = array( 
            "#"=>"\\#",
            "$"=>"\\$",
            "%"=>"\\%",
            "&"=>"\\&",
            "~"=>"\\~{}",
            "_"=>"\\_",
            "^"=>"\\^{}",
            "\\"=>"\\textbackslash",
            "{"=>"\\{",
            "}"=>"\\}",
    );
    return preg_replace( "/([\^\%~\\\\#\$%&_\{\}])/e", "\$map['$1']", $string );
}

?>
