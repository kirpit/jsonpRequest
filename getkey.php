<?php
/**
 * Ajax response file to provide the dynamic API key
 * 
 * @author serkan
 */


// API key holder file - should be somewhere not public
$apikey_filepath = 'apikey.txt';

// security routines
$is_auth_ok = TRUE;
$is_ajax = isset($_SERVER['HTTP_X_REQUESTED_WITH']) AND 
		  strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';

if (!$is_ajax OR !$is_auth_ok) {
	// bad things happening here!
	header('HTTP/1.0 401 Unauthorized');
	exit(0);
}

// are we gonna update the token?
if (file_exists($apikey_filepath)) {
	// update every 10 min anyway
	$update_key = (time() - filemtime($apikey_filepath)) > 10*60 ? TRUE : FALSE;
} else {
	// first run
	file_put_contents($apikey_filepath, '');
	$update_key = TRUE;
}

// do update api key 
if ($update_key) {
	// api doesnt support this feature yet
}

// lets go
$apikey = file_get_contents($apikey_filepath);
$token = base64_encode("apiuser:$apikey");

// echo $apikey;
echo $token;

