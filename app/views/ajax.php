<?php
// Options for unicode
mb_language('uni');
mb_internal_encoding('UTF-8');

// Figure out which method we want
$task = $_GET["task"];

// This is a bit simple, but what the heck, I'm coding php...
switch ($task) {
	case 'abstract':
		$output = get_abstract();
		break;
	
	default:
		$output = "Task not recognized";
		break;
}

// Echo out whatever output we got
echo $output;


// Function which fetches an abstract
function get_abstract() {

	// Get ID
	$id			= $_GET["id"];
	$file		= $id.".abstract.txt";

	// Make sure we have sufficient zeros in front
	for ($i = 0; $i < 10 && !file_exists( $file ); $i++)
		$file 	= str_repeat("0",$i).$id.".abstract.txt";

	// Now get contents (which are formatted as UTF-16)
	$content	= file_get_contents($file, FILE_TEXT);
	$content 	= mb_convert_encoding($content, "UTF-16");
	$content	= utf8_urldecode($content);
	$abstract	= htmlentities(substr($content,18,-1));

	// Do a bit of work on the abstract
	$wrong = array(); $right = array();

	$wrong[] = "&ucirc;"; 		$right[] = "fi";	// fi ligature
	$wrong[] = "&quot;d"; 		$right[] = "&le;";	// fi ligature
	$wrong[] = "&iuml;&not;";	$right[] = "fi";	// fi ligature
	$wrong[] = "&acirc;‰&curren;";	$right[] = "&le;";	// fi ligature
	$wrong[] = "&ordm;";	$right[] = "&#954;";	// fi ligature
	$wrong[] = "&acute;";	$right[] = "&#948;";	// fi ligature
	$wrong[] = "&quot;&yen;";	$right[] = "&#8869;";	// fi ligature
	$wrong[] = "&quot;H";	$right[] = "&#8776;";	// fi ligature
	$wrong[] = "&quot;";	$right[] = "&#9827;";	// fi ligature
	$wrong[] = "&sup3;";	$right[] = "&#947;";	// fi ligature
	$wrong[] = "&Aacute;";	$right[] = "&#961;";	// fi ligature
	$wrong[] = "&Auml;";	$right[] = "&#964;";	// fi ligature
	$wrong[] = "&raquo;";	$right[] = "&#955;";	// fi ligature

	$abstract	= str_replace($wrong, $right, $abstract);

	// Return the abstract
	return $abstract;
}

function utf8_urldecode($str) {

  $str = str_replace("\\00", "%u00", $str);

  $str = preg_replace("/%u([0-9a-f]{3,4})/i","&#x\\1;",urldecode($str));

  return $str;

}
?>
