document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const overlay = document.querySelector('.overlay'),
        quiz = document.querySelector('.quiz'),
        passTestButton = document.querySelector('.pass-test__button'),
        quizBodyForm = document.querySelector('.quiz-body__form'),
        formItems = quizBodyForm.querySelectorAll('fieldset'),
        btnsNext = quizBodyForm.querySelectorAll('.form-button__btn-next'),
        btnsPrev = quizBodyForm.querySelectorAll('.form-button__btn-prev');

    const answersObj = {
        step0: {
            qustion: '',
            answers: []
        },
        step1: {
            qustion: '',
            answers: []
        },
        step2: {
            qustion: '',
            answers: []
        },
        step3: {
            qustion: '',
            answers: []
        },
        step4: {
            name: '',
            phone: '',
            email: '',
            call: ''
        }
    };

    btnsNext.forEach(item => item.style.pointerEvents = 'none');


    const openQuiz = event => {
            overlay.removeAttribute('style');
            quiz.removeAttribute('style');
        },
        startQuiz = () => {
            overlay.style.display = 'none';
            quiz.style.display = 'none';
            formItems.forEach((formItem, i) => {

                if (i === 0) {
                    formItem.style.display = 'block';
                } else {
                    formItem.style.display = 'none';
                }

                if (i !== formItems.length - 1) {
                    const inputs = formItem.querySelectorAll('input');
                    const itemTitle = formItem.querySelector('.form__title');

                    answersObj[`step${i}`].qustion = itemTitle.textContent;

                    inputs.forEach(input => {
                        const parent = input.parentNode;
                        input.checked = false;

                        parent.classList.remove('active-radio');
                        parent.classList.remove('active-checkbox');
                    });

                    formItem.addEventListener('change', e => {
                        const inputsChecked = formItem.querySelectorAll('input:checked');


                        inputsChecked.forEach(inputChecked => {
                            answersObj[`step${i}`].answers.length = 0;
                            answersObj[`step${i}`].answers.push(inputChecked.value);
                        });

                        const target = e.target;

                        if (inputsChecked.length > 0) {
                            btnsNext[i].style.pointerEvents = '';
                        } else {
                            btnsNext[i].style.pointerEvents = 'none';
                        }

                        if (target.classList.contains('form__radio')) {
                            const radio = formItem.querySelectorAll('.form__radio');

                            radio.forEach(input => {
                                if (input === target) {
                                    input.parentNode.classList.add('active-radio');
                                } else {
                                    input.parentNode.classList.remove('active-radio');
                                }
                            });

                        } else if (target.classList.contains('form__input')) {
                            target.parentNode.classList.toggle('active-checkbox');
                        } else {
                            return;
                        }
                    });
                } else {
                    sendForm();
                }
            });
        },
        sendForm = () => {
            const lastFieldset = formItems[formItems.length - 1];

            quizBodyForm.addEventListener('submit', e => {
                e.preventDefault();

                answersObj[`step${formItems.length - 1}`].name = document.getElementById('quiz-name').value;
                answersObj[`step${formItems.length - 1}`].phone = document.getElementById('quiz-phone').value;
                answersObj[`step${formItems.length - 1}`].email = document.getElementById('quiz-email').value;
                answersObj[`step${formItems.length - 1}`].quiz = document.getElementById('quiz-call').value;

                if (answersObj[`step${formItems.length - 1}`].name !== '' &&
                    answersObj[`step${formItems.length - 1}`].phone !== '' &&
                    answersObj[`step${formItems.length - 1}`].email !== '' &&
                    document.getElementById('quiz-policy').checked === true) {
                    postData(answersObj)
                        .then(res => {
                            if (!res.ok) {
                                throw new Error(`Ошибка ${res.status}`);
                            }
                            document.getElementById('quiz-name').value = '';
                            document.getElementById('quiz-phone').value = '';
                            document.getElementById('quiz-email').value = '';
                            document.getElementById('quiz-call').value = '';
                            
                            startQuiz();
                            alert(res["message"]);
                        })
                        .catch(error => console.error(error));
                } else {
                    alert('Введите данные и дайте согласие на их обработку!!!');
                }
            });
        },
        postData = (body) => {
            return fetch('./server.php', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });
        };

    startQuiz();


    passTestButton.addEventListener('click', openQuiz);

    quiz.addEventListener('click', e => {


        const target = e.target;

        if (target.closest('.form-button__btn-next')) {
            e.preventDefault();
            btnsNext.forEach((btn, btnIndex) => {
                if (btn === target.closest('.form-button__btn-next')) {
                    formItems[btnIndex].style.display = 'none';
                    formItems[btnIndex + 1].style.display = 'block';
                }
            });
        }

        if (target.closest('.form-button__btn-prev')) {
            e.preventDefault();
            btnsPrev.forEach((btn, btnIndex) => {
                if (btn === target.closest('.form-button__btn-prev')) {
                    formItems[btnIndex].style.display = 'block';
                    formItems[btnIndex + 1].style.display = 'none';
                }
            });
        }
    });

});