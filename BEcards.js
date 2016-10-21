document.addEventListener("DOMContentLoaded", function() {
   console.log("DOM fully loaded and parsed.");
   $('#input-phrase').focus();
});

$(function() {

console.log("Running script.");
var alternatives = new Array(0);
var wrongs = new Array(0);
var selectedPhraseIndex = -1;
var questionNumber;
var currentQ;
var currentA;

function fetchData(id) {
  $url = "BEcards.php?id=" + id;
  $.getJSON($url, '', function(data)
  {
    if (data == null) {
      console.log("null");
    } else {
      questionNumber = parseInt(data[0]);
      currentQ = data[1];
      currentA = data[2];

      $('#question-number').html(questionNumber);
      $('#edit-english-phrase').val(currentQ);
      $('#edit-spanish-phrase').val(currentA);

      if (questionNumber == 1) {
        $('#previous-question').hide();
      } else {
        $('#previous-question').show();
      }
    }
  });
}

function saveData() {
  var question = $('#edit-english-phrase').val();
  var answer = $('#edit-spanish-phrase').val();
  if (question != currentQ || answer != currentA) {
    currentQ = question;
    currentA = answer;
    $.ajax({
        type: "POST",
        url: "BEcards.php",
        data: {"id":questionNumber, "q":question, "a":answer},
    });
    console.log("database updated");
  }
}

function deleteDetailListElement(event) {
  var thisIndex = 0;
  var isAlternative = $(event.target).parent().hasClass("alternative");
  var isWrong = $(event.target).parent().hasClass("wrong");
  var $sibling = $(event.target).parent().prev();
  while ($sibling != null && $sibling.is("div") && ($sibling.hasClass("wrong") || $sibling.hasClass("alternative"))) {
    thisIndex++;
    $sibling = $sibling.prev();
  }
  if (isAlternative) {
    alternatives[selectedPhraseIndex].splice(thisIndex, 1);
  } else if (isWrong) {
    wrongs[selectedPhraseIndex].splice(thisIndex, 1);
  }
  event.target.parentElement.remove();
}

function addDetail(element, value) {
  $('#' + element + '-area').append('<div class="' + element + '"><input type="text" spellcheck="true" value="' + value + '"><img class="delete-button" src="delete.png" alt="delete ' + element + '" style="width:16px;height:16px"/></div>');
  var elButton = $('#' + element + '-area .delete-button:last');
  elButton.on('click', deleteDetailListElement);
}

function addDetailListElement($elInput) {
  var value = $elInput.val();
  if (value) {
    $elInput.val(null);
    if (value.trim().length > 0) {
      var isAlternative = $elInput.attr('id') == "input-alternative";
      var isWrong = $elInput.attr('id') == "input-wrong";
      if (isAlternative) {
        element = "alternative";
        alternatives[selectedPhraseIndex].push(value);
      } else if (isWrong) {
        element = "wrong";
        wrongs[selectedPhraseIndex].push(value);
      }
      addDetail(element, value);
    }
    $elInput.focus();
  }
}


// TODO
function deletePhrase() {
  if (selected) {
    $('#phrase-details').css('visibility', 'hidden');
    selectedPhraseIndex = -1;
  }
}

function selectPhrase($elButton) {
  $('#phrases div button').css('background-color', '');
  $elButton.css('background-color', 'PaleTurquoise');
  selectedPhraseIndex = $elButton.parent().index();
  $('#alternative-area .alternative').remove();
  $('#wrong-area .wrong').remove();
  alternatives[selectedPhraseIndex].forEach(function(x) {addDetail("alternative", x);});
  wrongs[selectedPhraseIndex].forEach(function(x) {addDetail("wrong", x);});
  $('#edit-selected-phrase').val($elButton.text());
  $('#phrase-details').css('visibility', 'visible');
}

function addPhrase($elInputPhrase) {
  if ($elInputPhrase.val()) {
    var value = $elInputPhrase.val();
    $elInputPhrase.val(null);
    $('#phrases').append('<div><button>' + value + '</button></div>');
    alternatives.push(new Array(0));
    wrongs.push(new Array(0));
    var $elButton = $('#phrases div:last button');
    $elButton.on('click', function() {selectPhrase($elButton);});
    selectPhrase($elButton);
    $elInputPhrase.focus();
  }
}

// Start at question 1
fetchData(1);

// Events
$('#edit-english-phrase').on('blur', saveData);
$('#edit-spanish-phrase').on('blur', saveData);

$('#add-phrase-button').on('click', function() {addPhrase($('#input-phrase'));});
$('#input-phrase').on('keypress', function (e) {if (e.which === 13) {addPhrase($('#input-phrase'));}});

$('#add-alternative-button').on('click', function() {addDetailListElement($('#input-alternative'));});
$('#input-alternative').on('keypress', function (e) {if (e.which === 13) {addDetailListElement($('#input-alternative'));}});

$('#add-wrong-button').on('click', function() {addDetailListElement($('#input-wrong'));});
$('#input-wrong').on('keypress', function(e) {if (e.which === 13) {addDetailListElement($('#input-wrong'));}});

$('#previous-question').on('click', function() {fetchData(questionNumber - 1);});
$('#next-question').on('click', function() {fetchData(questionNumber + 1);});

});
