<?php require_once('Globals.php');
  $tableName = "Questions";

  if (isset($_POST['t'])) {
    $mysqli = getNewMysqli();
    $table = $_POST['t'];
    $id = $_POST['id'];
    $question = $_POST['q'];
    $answer = $_POST['a'];
    $result = $mysqli->query("INSERT INTO $table (id, question, answer) VALUES($id, '$question', '$answer') ON DUPLICATE KEY UPDATE question='$question',answer='$answer'") or die($mysqli->error);
  }

  else if (isset($_GET['id'])) {
    $id = $_GET['id'];
    $mysqli = getNewMysqli();
    $result = $mysqli->query("SELECT * FROM $tableName WHERE id=$id") or die($mysqli->error);
    $row = $result->fetch_row();
    echo json_encode($row);
  }
?>
