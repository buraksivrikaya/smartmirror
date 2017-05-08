<?php
    $ssid = $_GET['ssid'];
    $pass = $_GET['pass'];

    $output = array();
    $command = "nmcli device wifi con \"$ssid\" password \"$pass\"";
    exec('sudo -u root -S { $command } < .sudopass/sudopass', $output);
    //exec ($command);
    if(true){
        echo "1";
    }
    else{
        echo "0";
    }
?>
