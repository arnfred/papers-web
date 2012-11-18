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



// Create temporary page "your download should appear in a moment. If not click here"
echo page_output($temp_output);





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
	$schedule	= "BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//hacksw/handcal//NONSGML v1.0//EN";
	$date		= "";
	$time		= "";
	
	
	// Now for each paper, write it out
	foreach ($papers as $p) {
		// Check if the date is the same as before
		$newDate 	 = date('l \t\h\e jS \of F Y', $p->date);
		$newTime 	 = date('h:i A', $p->date);

		

		// Add schedule point
		if ($newTime == $time) $schedule .= add_schedule_point($p,"");
		else				   $schedule .= add_schedule_point($p,$newTime);

		// Add schedule point and update date
		$date		= $newDate;
		$time		= $newTime;
	}

	// Save schedule to file
	$schedule .= "END:VCALENDAR"
	return $schedule;

}


/**
 * Add a single paper in the schedule
 */
function add_schedule_point($p, $time) {
	
	// Get abstract
	$id	 	 = $p->id;
	$abstr	 = "";
	if ($_POST["abstract"] == 1) {
		$abstr	= file_get_contents("data/".$id.".abstract.txt");
	}

	// Get title
	$title	 = latexSpecialChars( $p->title, "\\'\"&\n\r{}[]" );
	$title	 = "{\\it ".$title."} \\\\ \n";

	// Get time and place
	if ($time == "") $point = "\\item[{\\hfill ".$p->room."}]\n";
	else			 $point = "\\item[{\\hfill \bf ".$time."} \\\\ {\\hfill ".$p->room."}]\n";

	// Get authors
	$authors = "{".$p->authors."} \\\\ \n";
	
	$event = "BEGIN:VEVENT
	UID:" . md5(uniqid(mt_rand(), true)) . "@trailhead
	DTSTAMP:" . gmdate('Ymd').'T'. gmdate('His') . "Z
	DTSTART:19970714T170000Z
	DTEND:19970715T035959Z
	SUMMARY:".$abstr."
	END:VEVENT";
	
	return $point.$title.$authors.$abstr."\n";
}


/**
 * Sorts two items based on their date
 */ 
function sort_by_date($a, $b) {
	return ($a->date < $b->date) ? -1 : 1; 
}




?>
