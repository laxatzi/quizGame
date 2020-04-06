{
   "use strict";
     
        const quizGame = {
        "name":"Super Hero Name Quiz",
        "description":"How many super heroes can you name?",
        "questionCore":"What is the real name of ",
        "questions": [
          { "question": "Superman", "answer": "Clarke Kent", "asked": false },
          { "question": "Batman", "answer": "Bruce Wayne", "asked": false },
          { "question": "Wonder Woman", "answer": "Dianna Prince", "asked": false },
          { "question": "Spider-man", "answer": "Peter Parker", "asked": false },
          { "question": "Iron-man", "answer": "Tony Stark", "asked": false },
          {"question": "Captain-America", "answer": "Steve Rogers", "asked": false},
          {"question": "Black Panther", "answer" : "T'Chaka", "asked": false},
          {"question": "Thor", "answer": "Donald Blake", "asked": false}
        ]
        };// end of obj
      
        //// views ////
        const $question = document.getElementById("question");
        const $score = document.getElementById("score");
        const $feedback = document.getElementById("feedback");
        const $start = document.getElementById("start");
        const $form = document.getElementById("answer");
        const $timer = document.getElementById("timer");
        const $reloader = document.getElementById("reload");
   
        /// view functions ///
      
        function update(element,content,klass) {
          const p = element.firstChild || document.createElement("p");
          p.textContent = content;
          element.appendChild(p);
          if(klass) {
            p.className = klass;
          }
        }
      
        function hide(element) {
          element.style.display = "none";
        }
      
        function show(element) {
          element.style.display = "block";
        }
      
        // Event listeners
        $start.addEventListener('click', function() { play(quizGame); } , false);
      
        // hide the form at the start of the game
        hide($form);
        // hide the reload button before the game is over
        hide($reloader);
        //add event listener for reloading page when clicking again button
       $reloader.addEventListener('click', function(){
         location.reload();
      });
   
        //// function definitions ////
   
        function random(a,b,callback) {
          if(b===undefined) {
            // if only one argument is supplied, assume the lower limit is 1
              b = a, a = 1;
            } 
          let result = Math.floor((b-a+1) * Math.random()) + a;
          if(typeof callback === "function") {
            result = callback(result);
          }
          return result;
        }
   
         // A main function that contains all the steps of playing the game
       function play(quizGame){ // we insert the quiz arr as an argument
          let score = 0; // initialize score
          update($score,score); // display score into header
          // initialize time and set up an interval that counts down every second
          let time = 20;
         //update time element by displaying remaining time
          update($timer,time);
          //The setInterval() method calls a function or evaluates an expression at specified intervals (in milliseconds). Syntax: (function, ms, params...); The clearInterval() method cancels the periodic execution of the function
          let interval = window.setInterval( countDown , 1000 );
          // hide button and show form
          hide($start);
          show($form);
          // add event listener to form for when it's submitted
          $form.addEventListener('click', function(event) { 
            event.preventDefault();
            check(event.target.value);
            }, false);
   
          let questionCurrent; // current question
          chooseQuestion();
      
     // nested functions
          function chooseQuestion() {
            console.log("chooseQuestion() invoked");
            const questions = quizGame.questions.filter(function(question){
              return question.asked === false;//return array containing only questions that haven't been asked yet
            });
            // set the current question
            // random is used to select a number between 1 and the length of this ,yet to asked questions, array.
            questionCurrent = questions[random(questions.length) - 1];
            ask(questionCurrent);
          }
          
          function ask(questionCurrent) {
            console.log("ask() invoked");
            // set the question.asked property to true so it's not asked again
            questionCurrent.asked = true;
            update($question,quizGame.questionCore + questionCurrent.question + "?");
            // clear the previous options(answers)
            $form.innerHTML = "";
            // create an array to put the different options in and a button constiable
            const options = [], button;
            const option1 = chooseOption();
            options.push(option1.answer);
            const option2 = chooseOption();
            options.push(option2.answer);
            // add the actual answer at a random place in the options array
            options.splice(random(0,2),0,questionCurrent.answer);
            // loop through each option and display it as a button
            options.forEach(function(name) {
              button = document.createElement("button");
              button.value = name;
              button.textContent = name;
              $form.appendChild(button);
            });
            
            // choose an option from all the possible answers but without choosing the answer or the same option twice
            function chooseOption() {
              const option = quizGame.questions[random(quizGame.questions.length) - 1];
              // check to see if right option doesn't exist or if it does exist it appears already (more than once)
              if(option === questionCurrent || options.indexOf(option.answer) !== -1) {
                return chooseOption();
              }
              return option;
            }
          }
      
          function check(answer) {
            console.log("check() invoked");
            if(answer === questionCurrent.answer){
              update($feedback,"Correct!","correct");// add a 3rd arg to style as we wish
              // increase score by 1
              score++;
              update($score,score)
            } else {
              update($feedback,"Wrong!","wrong");// add a 3rd arg to style as we wish
            }
            chooseQuestion();
          }
          
          // this is called every second and decreases the time
          function countDown() {
            // decrease time by 1
            time--;
            // update the time displayed
            update($timer,time);
            // the game is over if the timer has reached 0
            if(time <= 0) {
              gameOver();
            }
          }
      
          function gameOver(){
            console.log("gameOver() invoked");
            // inform the player that the game has finished and tell them how many points they have scored
            update($question,"Game Over, you scored " + score + " points out of 8!");
            hide($form);
            hide($feedback)
         // remove the interval (countdown) when game has finished (otherwise it will continue counting down ad infinitum)
            window.clearInterval(interval);
            show($reloader);
          }// end gameOver

        } // end of play
   
      }// Wrapping all the code inside an immediately invoked function
   