<?php

$data = QueryList::get('https://www.baidu.com/s?wd=QueryList')
      // 设置采集规则
      ->rules([ 
          'title'=>array('h3','text'),
          'link'=>array('h3>a','href')
      ])
      ->queryData();

  print_r($data);