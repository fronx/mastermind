var gameType = 0;

var colours = [
  "question.gif",
  "yellow.gif",
  "green.gif",
  "blue.gif",
  "red.gif",
  "grey.gif",
  "orange.gif"
];

var answer,
    turn;

var toggleType = function (element) {
  var message = {
    unique: 'Using unique colour rules.<br /><button>Switch to repeated colour rules</button>',
    repeated: 'Using repeated colour rules.<br /><button>Switch to unqiue colour rules</button>'
  };

  gameType = gameType === 0 ? 1 : 0;
  element.innerHTML = gameType ? message.repeated : message.unique;
  reloadGame();
};

var initializeVariables = function () {
  answer = [];
  turn = new Matrix(12, 10);
};

var initializeBoard = function() {
  initializeVariables();
  answer = makeAnswer(gameType);
  for (var i=0; i<4; i++) {
    document.images[110+i].src = "question.gif";
  }
  initializeNext(1);
};

var initializeNext = function (i) {
  if ( i==11 ) {
    gameOver(0);
  } else {
    if ( i>1 ) {
      document.images[ (i-1)*10 - 1 ].src = "blank.gif";
    }
    document.images[ i*10 - 1 ].src = "submit.gif";
    for (var j=0; j<4; j++){
      document.images[ (i-1)*10 + j ].src = colours[0];
    }
    turn[i][5] = 1;
  }
};

var makeAnswer = function (type) {
  var answer = [];
  var options = [1, 2, 3, 4, 5, 6];
  var i, j;
  for (i = 0; i < 4; i++) {
    j = Math.floor(Math.random() * options.length);
    answer[i+1] = options[j];
    if (type === 0) { // unique. remove options
      options[j] = 0;
      options.sort();
      options.shift();
    }
  }
  return answer;
};

var Matrix = function (r, c) {
  var i, j;
  for (i = 1; i<=r; i++) {
    this[i] = [];
    for (j = 1; j<=c; j++) {
      this[i][j]     = 0;
    }
  }

  return this;
};

var turnStatus = function (i, j) {
  if ( turn[i][5] ) {
    if ( j < 5 ) {
      rotateColour(i,j);
    } else if ( j==10 && turn[i][1] && turn[i][2] && turn[i][3] && turn[i][4] ) {
      submitGuess(i);
    }
  }
};

var rotateColour =  function (i, j) {
  n = turn[i][j];
  if (n == 6 ) turn[i][j] = 0;
  else turn[i][j] = n+1;
  document.images[ (i-1)*10 + (j-1) ].src = colours[turn[i][j]];
};

var submitGuess = function (i) {
  var guess = [];
  var j;
  turn[i][5] = 0;
  for (j=0; j<4; j++) {
    guess[j] = turn[i][j+1];
  }
  if ( (guess[0] == answer[1]) && (guess[1] == answer[2]) && (guess[2] == answer[3]) && (guess[3] == answer[4]) ) {
    gameOver(1);
  } else {
    reportResults(i, guess);
    initializeNext(i+1);
  }
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


var reportResults = function (i, guess) {
  var cluepegs = [
    "blank.gif",
    "black.gif",
    "white.gif"
  ];

  var dummyanswer = [];
  var clues = [0, 0, 0, 0];

  // build a clone of answer
  [0, 1, 2, 3].forEach(function (j) {
    dummyanswer[j+1] = answer[j+1];
  });

  // check for exact matches
  [0, 1, 2, 3].forEach(function (j) {
    if ( guess[j] == dummyanswer[j+1] ) {
      clues[j] = 2;
      guess[j] = 0;
      dummyanswer[j+1] = 7;
    }
  });

  // check for other matches
  [0, 1, 2, 3].forEach(function (j) {
    if ( guess[0] == dummyanswer[j+1] ) {
      clues[j] = 1;
      guess[0] = 0;
      dummyanswer[j+1] = 7;
    } else if ( guess[1] == dummyanswer[j+1] ) {
      clues[j] = 1;
      guess[1] = 0;
      dummyanswer[j] = 7;
    } else if ( guess[2] == dummyanswer[j+1] ) {
      clues[j] = 1;
      guess[2] = 0;
      dummyanswer[j+1] = 7;
    } else if ( guess[3] == dummyanswer[j+1] ) {
      clues[j] = 1;
      guess[3] = 0;
      dummyanswer[j+1] = 7;
    }
  });

  // sort result
  clues.sort().reverse();

  // show the result
  [0, 1, 2, 3].forEach(function (j) {
    document.images[ (i-1)*10 + j + 5 ].src = cluepegs[ clues[j] ];
  });
};

var reloadGame = function () {
  var i;
  for (i=0; i<109; i++) document.images[i].src = "blank.gif";
  initializeBoard();
};

var revealAnswer = function () {
  var i;
  for (i=1; i<=10; i++) {
    turn[i][5] = 0;
  }
  for (i=1; i<=4; i++) {
    document.images[109+i].src = colours[answer[i]];
  }

};

initializeBoard();
