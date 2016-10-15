document.addEventListener("DOMContentLoaded", function() {
   console.log("DOM fully loaded and parsed.");
   $('#input-phrase').focus();
});

$(function() {

console.log("Running script.");
var alternatives = new Array(0);
var wrongs = new Array(0);
var selectedPhraseIndex = -1;
var questionNumber = 0;

$('#question-number').val(questionNumber);

function fetchData(q) {
  $url = "BEcards.php?q=" + q;
  $.getJSON($url, '', function(data)
  {
    if (data == null) {
      console.log("null");
    } else {
      var id = data[0];
      var question = data[1];
      var answer = data[2];

      console.log("id=" + id + ", question=" + question + ", answerlist=" + answerlist);
    }
  });
}

fetchData(questionNumber);

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
    if ($('#answer div').length == 0) {
      $('#answer').append('<div>' + value + '</div>');
    } else {
      $('#answer div').append(' ' + value);
    }
    $('#phrases').append('<div><button>' + value + '</button></div>');
    alternatives.push(new Array(0));
    wrongs.push(new Array(0));
    var $elButton = $('#phrases div:last button');
    $elButton.on('click', function() {selectPhrase($elButton);});
    selectPhrase($elButton);
    $elInputPhrase.focus();
  }
}

// Events
$('#add-phrase-button').on('click', function() {addPhrase($('#input-phrase'));});
$('#input-phrase').on('keypress', function (e) {if (e.which === 13) {addPhrase($('#input-phrase'));}});

$('#add-alternative-button').on('click', function() {addDetailListElement($('#input-alternative'));});
$('#input-alternative').on('keypress', function (e) {if (e.which === 13) {addDetailListElement($('#input-alternative'));}});

$('#add-wrong-button').on('click', function() {addDetailListElement($('#input-wrong'));});
$('#input-wrong').on('keypress', function(e) {if (e.which === 13) {addDetailListElement($('#input-wrong'));}});

});
