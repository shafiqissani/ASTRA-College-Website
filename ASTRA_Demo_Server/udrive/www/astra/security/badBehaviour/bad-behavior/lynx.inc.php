<?php if (!defined('BB2_CORE')) die('Access Denied');

// Analyze user agents claiming to be Lynx

function bb2_lynx($package)
{
	if (!array_key_exists('Accept', $package['headers_mixed'])) {
		return "17566707";
	}
	return false;
}

?>
