<?php require_once('Globals.php');
  $tableQuestions = "Questions";

  if (isset($_POST['id'])) {
    $mysqli = getNewMysqli();
    $id = $_POST['id'];
    $question = $_POST['q'];
    $answer = $_POST['a'];
    $result = $mysqli->query("INSERT INTO $tableQuestions (id, question, answer) VALUES($id, '$question', '$answer') ON DUPLICATE KEY UPDATE question='$question',answer='$answer'") or die($mysqli->error);
  }

  else if (isset($_GET['id'])) {
    $id = $_GET['id'];
    $mysqli = getNewMysqli();
    $result = $mysqli->query("SELECT * FROM $tableQuestions WHERE id=$id") or die($mysqli->error);
    $row = $result->fetch_row();
    echo json_encode($row);
  }
?>
