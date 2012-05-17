<?php

// Get selected papers from post
$selected = $_POST["papers"];

// Get json data
$source	= file_get_contents("js/data.json");
$json	= json_decode($source);

// Get list of selected papers with metadata from json
$papers	= get_papers($json->nodes, $selected);

// Dividing to get seconds in place of milliseconds
foreach ($papers as $p) $p->date = $p->date/1000;

// Get Temporary file
$postfix		= substr(md5(time().rand()),0,7);
$temp_content	= create_schedule($papers, $postfix);
$temp_output	= "tex/temp/output_$postfix";

// Create system call for generating pdf
$call	 = "cat tex/header.tex ";
$call	.= $temp_content . " ";
$call	.= "tex/footer.tex ";
$call	.= "| pdflatex --jobname ".$temp_output;

// Make system call
$ret = exec($call);

// Create temporary page "your download should appear in a moment. If not click here"
echo page_output($temp_output);

// Redirect to schedule
header( 'Location: '.$temp_output.'.pdf' ) ;



/**
 * Creates a list of selected papers with metadata
 */
function get_papers($json, $selected) {
	$result = array();
	foreach ($selected as $id) {
		$result[$id] = $json[$id];
	}
	return $result;
}


/**
 * Create Random File name
 */
function random_name($dir,$prefix) {
	return $dir.'/'.$prefix.'_'.md5(time().rand());
}


/**
 * Creates the content part of the schedule file
 */
function create_schedule($papers, $postfix) {

	// Sorts papers by date
	uasort($papers, "sort_by_date");
	
	// Schedule and date
	$schedule	= "";
	$date		= "";
	$time		= "";

	// Now for each paper, write it out
	foreach ($papers as $p) {
		// Check if the date is the same as before
		$newDate 	 = date('l \t\h\e jS \of F Y', $p->date);
		$newTime 	 = date('h:i A', $p->date);
		if ($newDate != $date) $schedule .= add_schedule_day($newDate);
		if ($newTime == $time) $schedule .= add_schedule_point($p,"");
		else				   $schedule .= add_schedule_point($p,$newTime);

		// Add schedule point and update date
		$date		= $newDate;
		$time		= $newTime;
	}

	// Save schedule to file
	$file = "tex/temp/content_$postfix.tex";
	file_put_contents($file, $schedule);

	return $file;

}

/**
 * Constructs the latex code for a page dedicated to a certain day
 */
function add_schedule_day($date) {
	$page	 = "\\clearpage";
	$page	.= "\\period{".$date."}";
	$page	.= "\\hfil\\break\\\\";
	return $page;
}

/**
 * Constructs the latex code for a single paper in the schedule
 */
function add_schedule_point($p, $time) {
	$title	 = latexSpecialChars( $p->title, "\\'\"&\n\r{}[]" );
	$room	 = $p->room;
	$point	 = "\\papertime{".$time."}";
	$point	.= "\\papertitle{".$title."}";
	//$point	.= "\\papertime{Room $room}";
	$point	.= "\\paperauthors{".$p->authors."}";
	$point	.= "\\paperroom{Room 00".$room."}";
	return $point;
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
