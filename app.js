        function setGameType(type) {
                GameType = type;
        }

        function ToggleType() {
                if (GameType === 0) GameType = 1;
                else GameType = 0;
                document.images[120].src = rules[GameType].src;
                ReloadGame();
        }

        function initializeVariables() {

                answer = [];

                dummyanswer = [];

                guess = [];

                clues = [];

                dummy = [null, 6, 5, 4, 3, 2, 1];

                rules = new MakeImageArray(3);
                rules[0].src = "repeated.gif";
                rules[1].src = "unique.gif";

                cluepegs = new MakeImageArray(3);
                cluepegs[0].src = "blank.gif";
                cluepegs[1].src = "black.gif";
                cluepegs[2].src = "white.gif";

                colours = new MakeImageArray(7);
                colours[0].src = "question.gif";
                colours[1].src = "yellow.gif";
                colours[2].src = "green.gif";
                colours[3].src = "blue.gif";
                colours[4].src = "red.gif";
                colours[5].src = "grey.gif";
                colours[6].src = "orange.gif";

                turn = new Make2DNumberArray(12, 10);

        }


        function initializeBoard() {
                initializeVariables();
                MakeAnswer(GameType);
                for (var i=0; i<4; i++) {
                        document.images[110+i].src = "question.gif";
                }
                initializeNext(1);
        }

        function initializeNext(i) {
                if ( i==11 ) {
                        GameOver(0);
                }
                else {
                        if ( i>1 ) {
                                document.images[ (i-1)*10 - 1 ].src = "blank.gif";
                        }
                        document.images[ i*10 - 1 ].src = "submit.gif";
                        for (var j=0; j<4; j++){
                                document.images[ (i-1)*10 + j ].src = colours[0].src;
                        }
                        turn[i][5] = 1;
                }
        }


        function MakeAnswer(type) {
                var i, j;
                if (type == 1) {
                        for (i = 1; i<=4; i++) {
                                j = Math.round( 1 + Math.random()*(6-1) );
                                answer[i] = dummy[j];
                        }
                }
                else {
                        for (i = 1; i<=4; i++) {
                                j = Math.round( 1 + Math.random()*(6-i) );
                                answer[i] = dummy[j];
                                dummy[j] = 0;
                                mySort(dummy,7-i);
                        }
                }
        }

        function MakeImageArray(n) {
                var i;
                this.length = n;
                for (i = 0; i<n; i++) {
                        this[i] = new Image();
                }

              return this;
        }

        function Make2DNumberArray(r,c) {
                var i, j;
                this.length = r;
                for (i = 1; i<=r; i++) {
                        this[i] = new Array(c);
                        for (j = 1; j<=c; j++) {
                                this[i][j]     = 0;
                        }
                }

              return this;
        }

        function TurnStatus(i,j) {
                if ( turn[i][5] ) {
                        if ( j < 5 ) {
                                RotateColour(i,j);
                        }
                        else if ( j==10 && turn[i][1] && turn[i][2] && turn[i][3] && turn[i][4] ) {
                                SubmitGuess(i);
                        }
                }
        }


        function RotateColour(i,j) {
                n = turn[i][j];
                if (n == 6 ) turn[i][j] = 0;
                else turn[i][j] = n+1;
                document.images[ (i-1)*10 + (j-1) ].src = colours[turn[i][j]].src;
        }


        function SubmitGuess(i) {
                var j;
                turn[i][5] = 0;
                for (j=1; j<=4; j++) {
                        guess[j] = turn[i][j];
                }
                if ( (guess[1] == answer[1]) && (guess[2] == answer[2]) && (guess[3] == answer[3]) && (guess[4] == answer[4]) ) {
                        GameOver(1);
                }
                else {
                        ReportResults(i);
                        initializeNext(i+1);
                }
        }

        function GameOver(win) {
                if (win) {
                        document.images[100].src = "letterW.gif";
                        document.images[101].src = "letterI.gif";
                        document.images[102].src = "letterN.gif";
                        document.images[103].src = "exclaim.gif";
                }
                else     {
                        document.images[100].src = "letterL.gif";
                        document.images[101].src = "letterO.gif";
                        document.images[102].src = "letterS.gif";
                        document.images[103].src = "letterE.gif";
                }
                RevealAnswer();
        }


        function ReportResults(i) {
                var j;
                for (j=1; j<=4; j++) {
                        dummyanswer[j] = answer[j];
                        clues[j] = 0;
                }
                for (j=1; j<=4; j++) {
                        if ( guess[j] == dummyanswer[j] ) {
                                clues[j] = 2;
                                guess[j] = 0;
                                dummyanswer[j] = 7;
                        }
                }
                for (j=1; j<=4; j++) {
                        if ( guess[1] == dummyanswer[j] ) {
                                clues[j] = 1;
                                guess[1] = 0;
                                dummyanswer[j] = 7;
                        }
                        else if ( guess[2] == dummyanswer[j] ) {
                                clues[j] = 1;
                                guess[2] = 0;
                                dummyanswer[j] = 7;
                        }
                        else if ( guess[3] == dummyanswer[j] ) {
                                clues[j] = 1;
                                guess[3] = 0;
                                dummyanswer[j] = 7;
                        }
                        else if ( guess[4] == dummyanswer[j] ) {
                                clues[j] = 1;
                                guess[4] = 0;
                                dummyanswer[j] = 7;
                        }
                }
                mySort(clues,4);
                for (j=1; j<=4; j++) {
                        document.images[ (i-1)*10 + j + 4 ].src = cluepegs[ clues[j] ].src;
                }
        }


        function mySort(myArray, n) {
                var i, j, temp;
                for (i=1; i<n; i++) {
                        for (j=(i+1); j<=n; j++) {
                                if ( myArray[j] > myArray[i]) {
                                        temp = myArray[i];
                                        myArray[i] = myArray[j];
                                        myArray[j] = temp;
                                }
                        }
                }
        }

        function ReloadGame() {
                var i;
                for (i=0; i<109; i++) document.images[i].src = "blank.gif";
                initializeBoard();
        }

        function RevealAnswer() {
                var i;
                for (i=1; i<=10; i++) {
                        turn[i][5] = 0;
                }
                for (i=1; i<=4; i++) {
                        document.images[109+i].src = colours[answer[i]].src;
                }

        }