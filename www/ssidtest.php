<?php

	$output = array();
    $command = "nmcli -f BARS,SSID dev wifi list";
    exec ($command , $output);

    $signalPowers = array();
    $ssids = array();

    for($i = 1; $i < count($output); $i++) {
    	if (strpos($output[$i], '***') !== false) {
    		array_push($ssids, trim(substr($output[$i], 4)));
    		array_push($signalPowers, 3);
		}
    	else if (strpos($output[$i], '**') !== false) {
    		array_push($ssids, trim(substr($output[$i], 3)));
    		array_push($signalPowers, 2);
		}
    	else {
    		array_push($ssids, trim(substr($output[$i], 2)));
    		array_push($signalPowers, 1);
		}
	}
	for ($i = 0; $i < count($signalPowers); $i++) {
		echo '<a class="btn btn-default btn-block list-group-item" style="text-align:left;overflow: hidden;" type="ssidButton">
				<img src="',$signalPowers[$i] > 2 ? "./images/wireless-icon-high.png": ($signalPowers[$i] == 2 ? "./images/wireless-icon-medium.png" : "./images/wireless-icon-low.png"), '" style="width:20px; height:auto; margin-right:10px; vertical-align: middle;">
				<h5 style="margin-right:10px; display:inline-block" data-type="ssid">',$ssids[$i],'</h5>
            </a>';
	}
?>
