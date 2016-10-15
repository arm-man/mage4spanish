<?php require_once('Globals.php');
  $databaseName = "spanishdb";
  $tableName = "Questions";

  if (isset($_GET['q'])) {
    $q = $HTTP_GET_VARS['q'];
    $mysqli = getNewMysqli();
    $result = $mysqli->query("SELECT * FROM $tableName WHERE id=" + q);
    if ($result == null) {
      echo "null";
    } else {
      echo "here";
      $row = $result->fetch_row();
      echo json_encode($row);
    }
  }

  // procedural style
  // $con = mysql_connect($host,$user,$pass);
  // $dbs = mysql_select_db($databaseName, $con);
  // $result = mysql_db_query("SELECT * FROM $tableName WHERE id=%d", $questionNumber);
  // $array = mysql_fetch_row($result);
  // echo json_encode($array);
?>
