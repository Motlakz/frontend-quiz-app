document.addEventListener('DOMContentLoaded', function () {
  fetch('./data.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {

      // Process the JSON data
      const quizzes = data.quizzes;

      // Function to display a quiz
      function displayQuiz(quiz) {
        const quizTopicElement = document.querySelector('.quiz-topic');

        quizTopicElement.innerHTML = `
          <h2 class="topic-name font-semibold flex items-center"><img src=${quiz.icon} alt="quiz icon"> ${quiz.title}</h2>        
        `;

        const questionNumberElement = document.getElementById('question-number');
        const remainingQuestionsElement = document.getElementById('remaining-questions');
        const questionTextElement = document.getElementById('question-text');
        const answerOptionsElement = document.getElementById('answer-options');

        // Display the first question initially
        let currentQuestionIndex = 0;

        const progressValue = (currentQuestionIndex / quiz.questions.length) * 100;
        const progressBar = document.querySelector('.progress');
        progressBar.style.width = `${progressValue}%`;

        function updateProgressBar() {
          const progressValue = (currentQuestionIndex / quiz.questions.length) * 100;
          progressBar.style.width = `${progressValue}%`;
        }

        displayQuestion(quiz.questions[currentQuestionIndex]);

        function displayQuestion(question) {
          questionNumberElement.innerText = currentQuestionIndex + 1;
          remainingQuestionsElement.innerText = ` / ${quiz.questions.length}`;
          questionTextElement.innerText = question.question;

          remainingQuestionsElement.classList.add('italic');

          // Clear previous answer options
          answerOptionsElement.innerHTML = '';

          // Display answer options
          question.options.forEach((option, index) => {
            const optionLabel = String.fromCharCode(65 + index);
        
            // Function to escape HTML special characters so code format questions can be rendered on the page
            const escapeHTML = (str) => {
                const div = document.createElement('div');
                div.appendChild(document.createTextNode(str));
                return div.innerHTML;
            };
        
            // HTML representation of the structure for each created element
            const optionHTML = `
              <label class="block text-lg mb-2 font-bold cursor-pointer your-option-class" onclick="checkAnswer(event, '${option}')">
                <input class="hidden" type="radio" name="answer" value="${option}">
                <p class="p-4 pl-2 border-2 border-transparent rounded-md bg-pink-100 shadow-lg text-gray-800 dark:text-white dark:shadow-purple-700/50 m-1 dark:bg-purple-600">
                  <span class="p-3 mr-3 border border-gray-500 dark:border-none rounded-md bg-[#F4F6FA] text-gray-600">${optionLabel}</span>
                  ${escapeHTML(option)}
                </p>
              </label>
            `;

            // Convert the HTML string to a DOM element
            const optionElement = new DOMParser().parseFromString(optionHTML, 'text/html').body.firstChild;

            // Add click event listener to each option
            answerOptionsElement.addEventListener('click', function (event) {
              const targetLabel = event.target.closest('label');

              if (targetLabel) {
                const selectedAnswer = targetLabel.querySelector('input').value;
                const correctAnswer = quiz.questions[currentQuestionIndex].answer;

                const optionParagraph = targetLabel.querySelector('p');

                if (selectedAnswer === correctAnswer) {
                  targetLabel.classList.add('correct');
                  targetLabel.classList.remove('incorrect');
                  optionParagraph.classList.add('correct');
                  optionParagraph.classList.remove('incorrect');
                  optionParagraph.style.border = '2px solid var(--correct-border-color)'

                } else {
                  targetLabel.classList.add('incorrect');
                  targetLabel.classList.remove('correct');
                  optionParagraph.classList.add('incorrect');
                  optionParagraph.classList.remove('correct');
                  optionParagraph.style.border = '2px solid var(--incorrect-border-color)';
                }

                // Remove the 'correct' or 'incorrect' class from all labels
                const allLabels = answerOptionsElement.querySelectorAll('label');
                allLabels.forEach((label) => {
                  if (label !== targetLabel) {
                    label.classList.remove('correct', 'incorrect');
                  }
                });

                // Prevent the form from being submitted when an option is clicked
                event.preventDefault();
              }
            });

            // Append the option to the container in the DOM
            answerOptionsElement.appendChild(optionElement);
          });

          const submitButton = document.createElement('button');
          submitButton.innerText = 'Submit Answer';
          submitButton.classList.add('form-button', 'bg-pink-500', 'p-4', 'rounded-md', 'm-1', 'font-semibold', 'text-white'); 

          submitButton.addEventListener('click', function(event) {
            // Move to the next question or finish the quiz
            currentQuestionIndex++;
            updateProgressBar();
            if (currentQuestionIndex < quiz.questions.length) {
              displayQuestion(quiz.questions[currentQuestionIndex]);
            } else {
              alert('Quiz Finished');
            }

            event.preventDefault();
          });
          answerOptionsElement.appendChild(submitButton);
        }
      }

      // Display the first quiz initially
      displayQuiz(quizzes[0]);

    })
    .catch(error => {
      console.error('Error during fetch operation:', error);
    });

  const modeToggle = document.getElementById('modeToggle');
  const body = document.body;

  function toggleTheme() {
    if (modeToggle.checked) {
      body.classList.add('dark');
    } else {
      body.classList.remove('dark');
    }
  }

  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    body.classList.add('dark');
    modeToggle.checked = true;
  } else {
    body.classList.remove('dark');
  }

  modeToggle.addEventListener('change', toggleTheme);
});
