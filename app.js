var gameType = 0;

var turn;

var colours = [
  "question.gif",
  "yellow.gif",
  "green.gif",
  "blue.gif",
  "red.gif",
  "grey.gif",
  "orange.gif"
];

var initializeBoard = function() {
  turn = new Matrix(10, 5);
  var answer = makeAnswer(gameType);
  [0, 1, 2, 3].forEach(function (i) {
    document.images[110+i].src = colours[0];
  });

  window.revealAnswer = function () {
    var i;
    for (i=0; i<10; i++) {
      turn[i][4] = 0;
    }
    [0, 1, 2, 3].forEach(function (i) {
      document.images[110+i].src = colours[answer[i]];
    });
  };

  window.submitGuess = function (i) {
    if ( ! (turn[i][0] && turn[i][1] && turn[i][2] && turn[i][3]) ) return;

    turn[i][4] = 0;

    var guess = [0, 1, 2, 3].map(function (j) {
      return turn[i][j];
    });

    var correct = guess.every(function (v, k) {
      return v === answer[k];
    });

    if ( correct ) {
      gameOver(1);
    } else {
      reportResults(i, guess, answer);
      initializeRow(i+1);
    }
  };

  initializeRow(0);
};

var initializeRow = function (i) {
  if ( i === 10 ) {
    gameOver(0);
  } else {
    if ( i > 0 ) {
      document.images[ i * 10 - 1 ].src = "blank.gif";
    }
    document.images[ (i+1) * 10 - 1 ].src = "submit.gif";
    [0, 1, 2, 3].forEach(function (j) {
      document.images[ i * 10 + j ].src = colours[0];
    });
    turn[i][4] = 1;
  }
};

var makeAnswer = function (type) {
  var answer = [];
  var options = [1, 2, 3, 4, 5, 6];
  var i, j;
  [0, 1, 2, 3].forEach(function (i) {
    j = Math.floor(Math.random() * options.length);
    answer[i] = options[j];
    if (type === 0) { // unique, therefore remove options
      options[j] = 0;
      options.sort();
      options.shift();
    }
  });
  return answer;
};

var Matrix = function (r, c) {
  var i, j;
  for (i = 0; i<r; i++) {
    this[i] = [];
    for (j = 0; j<c; j++) {
      this[i][j] = 0;
    }
  }

  return this;
};

var rotateColour =  function (i, j) {
  if ( !turn[i][4] ) return;

  n = turn[i][j];
  if (n == 6 ) turn[i][j] = 0;
  else turn[i][j] = n+1;
  document.images[ i * 10 + j ].src = colours[turn[i][j]];
};

var gameOver = function (win) {
  if (win) {
    document.images[100].src = "letterW.gif";
    document.images[101].src = "letterI.gif";
    document.images[102].src = "letterN.gif";
    document.images[103].src = "exclaim.gif";
  } else {
    document.images[100].src = "letterL.gif";
    document.images[101].src = "letterO.gif";
    document.images[102].src = "letterS.gif";
    document.images[103].src = "letterE.gif";
  }
  revealAnswer();
};


var reportResults = function (i, guess, answer) {
  var cluepegs = [
    "blank.gif",
    "black.gif",
    "white.gif"
  ];

  var dummyanswer = [];
  var clues = [0, 0, 0, 0];

  // build a clone of answer
  [0, 1, 2, 3].forEach(function (j) {
    dummyanswer[j] = answer[j];
  });

  // check for exact matches
  [0, 1, 2, 3].forEach(function (j) {
    if ( guess[j] == dummyanswer[j] ) {
      clues[j] = 2;
      guess[j] = 0;
      dummyanswer[j] = 7;
    }
  });

  // check for other matches
  [0, 1, 2, 3].forEach(function (j) {
    if ( guess[0] == dummyanswer[j] ) {
      clues[j] = 1;
      guess[0] = 0;
      dummyanswer[j] = 7;
    } else if ( guess[1] == dummyanswer[j] ) {
      clues[j] = 1;
      guess[1] = 0;
      dummyanswer[j] = 7;
    } else if ( guess[2] == dummyanswer[j] ) {
      clues[j] = 1;
      guess[2] = 0;
      dummyanswer[j] = 7;
    } else if ( guess[3] == dummyanswer[j] ) {
      clues[j] = 1;
      guess[3] = 0;
      dummyanswer[j] = 7;
    }
  });

  // sort result
  clues.sort().reverse();

  // show the result
  [0, 1, 2, 3].forEach(function (j) {
    document.images[ i * 10 + j + 5 ].src = cluepegs[ clues[j] ];
  });
};

var reloadGame = function () {
  var i;
  for (i=0; i<109; i++) document.images[i].src = "blank.gif";
  initializeBoard();
};

var toggleType = function (event) {
  var element = this;
  var message = {
    unique: 'Using unique colour rules.<br /><button>Switch to repeated colour rules</button>',
    repeated: 'Using repeated colour rules.<br /><button>Switch to unqiue colour rules</button>'
  };

  gameType = gameType === 0 ? 1 : 0;
  element.innerHTML = gameType ? message.repeated : message.unique;
  reloadGame();
};

document.getElementById('switcher').onclick = toggleType;

initializeBoard();
