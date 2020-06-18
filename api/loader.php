<?php
    $query= $_GET['query'];
    $query = str_replace('--','&',$query);
    $json = file_get_contents('https://newsapi.org/v2/'.$query);
    echo $json;