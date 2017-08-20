<?php require_once('Globals.php');
  $tableQuestions = "Questions";
  $tableAnswers = "Answers";

  if (isset($_POST['q'])) {
    $mysqli = getNewMysqli();
    $id = $_POST['id'];
    $question = $_POST['q'];
    $answer = $_POST['a'];
    $result = $mysqli->query("INSERT INTO $tableQuestions (id, question, answer) VALUES($id, '$question', '$answer') ON DUPLICATE KEY UPDATE question='$question',answer='$answer'") or die($mysqli->error);
  }

  else if (isset($_POST['p'])) {
    $mysqli = getNewMysqli();
    $id = $_POST['id'];
    $phrase = $_POST['p'];
    $index = "answer" . $_POST['i'];
    $mysqli->query("INSERT INTO $tableAnswers (answer) VALUES('$phrase')") or die($mysqli->error);
    $mysqli->query("UPDATE $tableQuestions SET $index = LAST_INSERT_ID() WHERE id=$id") or die($mysqli->error);
  }

  else if (isset($_GET['id'])) {
    $id = $_GET['id'];
    $mysqli = getNewMysqli();
    $result = $mysqli->query("SELECT * FROM $tableQuestions WHERE id=$id") or die($mysqli->error);
    $row = $result->fetch_row();
    echo json_encode($row);
  }
?>
