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
        const quizTopicElement = document.querySelector('.topic-name');
        const quizIconElement = document.querySelector('.quiz-icon');

        quizTopicElement.innerText = quiz.title;
        quizIconElement.innerHTML = `<i class="${quiz.icon}"></i>`;

        const questionNumberElement = document.getElementById('question-number');
        const remainingQuestionsElement = document.getElementById('remaining-questions');
        const questionTextElement = document.getElementById('question-text');
        const answerOptionsElement = document.getElementById('answer-options');

        // Display the first question initially
        let currentQuestionIndex = 0;
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
        
            // Convert HTML string to text content
            const optionTextNode = document.createTextNode(option);
        
            const optionElement = document.createElement('label');
            optionElement.classList.add('block', 'text-lg', 'mb-2', 'font-bold', 'cursor-pointer', 'group');
        
            const radioInput = document.createElement('input');
            radioInput.classList.add('hidden');
            radioInput.type = 'radio';
            radioInput.name = 'answer';
            radioInput.value = option;
        
            const optionContent = document.createElement('p');
            const spanElement = document.createElement('span');
            spanElement.classList.add('p-3', 'group-hover:bg-pink-500', 'dark:group-hover:bg-pink-300', 'mr-3', 'border', 'border-gray-500', 'dark:border-none', 'rounded-md', 'bg-[#F4F6FA]', 'text-gray-600', 'group-hover:text-white');
            spanElement.appendChild(document.createTextNode(optionLabel));
            optionContent.appendChild(spanElement);
            optionContent.classList.add('p-4', 'pl-2', 'group', 'border-2', 'dark:hover:border-pink-300', 'hover:border-pink-600', 'border-transparent', 'rounded-md', 'bg-pink-100', 'shadow-lg', 'text-gray-800', 'dark:text-white', 'dark:shadow-purple-700/50', 'm-1', 'dark:bg-purple-600');
            optionContent.appendChild(optionTextNode);
        
            optionElement.appendChild(radioInput);
            optionElement.appendChild(optionContent);
        
            // Add click event listener to each option
            optionElement.addEventListener('click', function(event) {
              const selectedAnswer = option;
              const correctAnswer = quiz.questions[currentQuestionIndex].answer;

              if (selectedAnswer === correctAnswer) {
                optionContent.classList.add('correct');
              } else {
                optionContent.classList.add('incorrect')
              }
        
              // Prevent the form from being submitted when an option is clicked
              event.preventDefault();
            });
        
            answerOptionsElement.appendChild(optionElement);
          });

          const submitButton = document.createElement('button');
          submitButton.innerText = 'Submit Answer';
          submitButton.classList.add('form-button', 'bg-pink-500', 'p-4', 'rounded-md', 'm-1', 'font-semibold', 'text-white'); 

          submitButton.addEventListener('click', function(event) {
            // Move to the next question or finish the quiz
            currentQuestionIndex++;
            if (currentQuestionIndex < quiz.questions.length) {
              displayQuestion(quiz.questions[currentQuestionIndex]);
            } else {
              console.log('Quiz Finished');
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
