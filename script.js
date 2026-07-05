/* =========================================
   SAVED THEME
========================================= */

let savedTheme =
localStorage.getItem("theme");


if(savedTheme){

    document.body.className =
    savedTheme;

}

/* =========================================
   RANDOM PARAGRAPHS
========================================= */

let paragraphs = [

"Typing regularly improves your focus, speed, and overall computer efficiency. Daily typing practice helps develop muscle memory and increases your confidence while working on digital platforms.",

"Technology has transformed education, communication, and business operations around the world. Learning modern digital skills is becoming more important for students and professionals every year.",

"Frontend development combines creativity and logic to build modern websites and web applications. Developers use HTML, CSS, and JavaScript to create responsive and interactive user experiences.",

"Consistent effort and patience are the keys to mastering any skill in life. Improving typing speed requires practice, concentration, and accuracy over a long period of time.",

"Artificial intelligence is rapidly changing industries by automating tasks and improving productivity. Businesses are adopting AI tools to simplify workflows and improve customer experiences.",

"Reading books daily improves vocabulary, imagination, and communication skills. Strong reading habits also help people think critically and express their ideas more clearly.",

"Healthy habits such as exercise, proper sleep, and balanced nutrition improve mental focus and energy levels. A healthy lifestyle increases productivity and long-term well-being.",

"Typing tests are commonly used in schools, offices, and government exams to measure speed and accuracy. Practicing daily can significantly improve typing confidence and performance.",

"Modern websites must be responsive so they can adapt to mobile phones, tablets, and desktop screens. Responsive design improves accessibility and user satisfaction.",

"JavaScript is one of the most powerful programming languages used for web development. It allows developers to create dynamic interfaces, animations, and interactive features.",

"Learning coding step by step helps beginners understand programming concepts more effectively. Building small projects is one of the best ways to improve development skills.",

"Time management is an important skill for achieving goals and maintaining productivity. Organizing tasks properly helps reduce stress and improve efficiency.",

"Communication skills play a major role in personal and professional success. Clear communication builds trust, teamwork, and stronger relationships between people.",

"The internet has created endless opportunities for learning, freelancing, and online businesses. People can now build careers and share knowledge globally from anywhere.",

"Professional developers focus not only on design but also on clean code structure and maintainability. Scalable architecture helps projects grow without becoming difficult to manage.",

"Typing accurately is more important than typing fast because fewer mistakes improve overall efficiency. Speed naturally increases over time with consistent accurate practice.",

"Dark mode interfaces reduce eye strain and provide a modern visual experience for users. Many popular applications now support both dark and light themes.",

"Web applications use structured layouts, reusable components, and optimized performance to create smooth user experiences. Clean interfaces make applications easier to use.",

"Problem solving is one of the most valuable skills in programming and software development. Developers constantly debug issues and improve systems through logical thinking.",

"Cloud hosting platforms allow developers to deploy websites quickly and efficiently. Services like Netlify and Vercel simplify deployment for frontend projects.",

"Creative thinking and technical skills together help developers build unique digital experiences. Modern web development requires both design understanding and logical problem solving.",

"Practice and consistency are more powerful than motivation alone. Small daily improvements eventually create significant long-term results and expertise.",

"Modern typing applications include real-time statistics, accuracy tracking, progress bars, and theme systems. These features improve engagement and learning experience.",

"User interface design focuses on creating visually appealing and user-friendly experiences. Good design improves usability and makes digital products more effective.",

"Continuous learning is essential in technology because tools and frameworks evolve rapidly. Developers who keep learning remain adaptable and competitive in the industry."

];



/* =========================================
   RANDOM TEXT
========================================= */

let originalText =
paragraphs[Math.floor(Math.random() * paragraphs.length)];



/* =========================================
   VARIABLES
========================================= */

let timer = 60;

let timerStarted = false;

let interval;



/* =========================================
   SHOW LETTERS
========================================= */

let textDiv =
document.getElementById("text");

if(textDiv){

    originalText.split("").forEach(function(char){

        let span =
        document.createElement("span");

        span.innerText = char;

        textDiv.appendChild(span);

    });

}



/* =========================================
   START TEST
========================================= */

function startTest(){


    document.getElementById("input").focus();


    if(timerStarted == false){

        timerStarted = true;


        interval = setInterval(function(){

            timer--;


            document.getElementById("time")

            .innerHTML = timer;



            if(timer <= 0){

                clearInterval(interval);

                alert("Time Up");

            }

        },1000);

    }

}



/* =========================================
   TYPING DETECTION
========================================= */

const inputBox =
document.getElementById("input");

if(inputBox){

inputBox.addEventListener("input",function(){


    if(timerStarted == false){

        startTest();

    }



    let inputText =
    this.value;



    let spans =
    document.querySelectorAll("#text span");



    
         let correctCount = 0;

         let mistakes = 0;



    spans.forEach(function(span,index){


    span.classList.remove("current");


        let typedChar =
        inputText[index];



        /* EMPTY */
 
if(index == inputText.length){

    span.classList.add("current");

}
 

/* AUTO SCROLL */

if(span.classList.contains("current")){

    span.scrollIntoView({

        behavior:"smooth",

        block:"center"

    });

}


        if(typedChar == null){

            span.classList.remove("correct");

            span.classList.remove("wrong");

        }



        /* CORRECT */

        else if(typedChar == span.innerText){

            span.classList.add("correct");

            span.classList.remove("wrong");

            correctCount++;

        }



        /* WRONG */

        else{

            span.classList.add("wrong");

            span.classList.remove("correct");
           mistakes++;

        }

    });




    /* =========================================
       WPM
    ========================================= */

    let words =
    inputText.trim().split(" ").length;


    document.getElementById("wpm")

    .innerHTML = words;




    /* =========================================
       ACCURACY
    ========================================= */

    let totalTyped =
correctCount + mistakes;


let accuracy = 0;


if(totalTyped > 0){

    accuracy =
    Math.floor((correctCount / totalTyped) * 100);

}


document.getElementById("accuracy")

.innerHTML = accuracy + "%";


document.getElementById("mistakes")

.innerHTML = mistakes;

let progress =
(inputText.length / originalText.length) * 100;


document.getElementById("progressBar")

.style.width = progress + "%";



    /* =========================================
       TEST COMPLETE
    ========================================= */

    if(inputText.trim() == originalText.trim()){

        clearInterval(interval);

        alert("Test Completed");

    }

});

}

/* =========================================
   RESTART TEST
========================================= */

function restartTest(){

    location.reload();

}

/* =========================================
   THEME TOGGLE
========================================= */

function toggleTheme(){


    let body =
    document.body;



    if(body.classList.contains("dark")){


        body.classList.remove("dark");

        body.classList.add("light");

    }


    else{


        body.classList.remove("light");

        body.classList.add("dark");

    }
localStorage.setItem(
"theme",
body.className
);

}

/* =========================================
   LOGIN MODAL
========================================= */

function openLoginModal(){

let modal =

document.getElementById(
"loginModal"
);

modal.style.visibility =
"visible";

modal.style.opacity =
"1";

document.querySelector(
".login-box"
).style.transform =
"scale(1)";

}


function closeLoginModal(){

let modal =

document.getElementById(
"loginModal"
);

modal.style.visibility =
"hidden";

modal.style.opacity =
"0";

}

/* =========================================
   MOBILE SLIDE MENU
========================================= */

const menuBtn =
document.getElementById(
"menuBtn"
);

const mobileMenu =
document.getElementById(
"mobileMenu"
);

if(menuBtn && mobileMenu){

menuBtn.addEventListener(
"click",
function(){

mobileMenu.classList.toggle(
"active"
);
document.body.style.overflowX = "hidden";
if(
mobileMenu.classList.contains(
"active"
)
){

menuBtn.innerHTML = "✕";

}
else{

menuBtn.innerHTML = "☰";

}

});

}

/* =========================================
   CLOSE MENU AFTER CLICK
========================================= */

const menuLinks =
document.querySelectorAll(
".menu-link"
);

menuLinks.forEach(function(link){

link.addEventListener(
"click",
function(){

mobileMenu.classList.remove(
"active"
);

menuBtn.innerHTML = "☰";

});

});



/* =========================================
   FAQ ACCORDION
========================================= */

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {

    const btn = item.querySelector(".faq-question");

    btn.addEventListener("click", () => {

        faqItems.forEach(other => {

            if(other !== item){

                other.classList.remove("active");

            }

        });

        item.classList.toggle("active");

    });

});


/* =========================================
   COURSES FAQ
========================================= */

const faqQuestions =
document.querySelectorAll(".faq-question");

faqQuestions.forEach(question=>{

question.addEventListener("click",()=>{

const currentItem=
question.parentElement;

const currentAnswer=
currentItem.querySelector(".faq-answer");

document
.querySelectorAll(".faq-item")
.forEach(item=>{

if(item!==currentItem){

item.querySelector(".faq-answer")
.style.display="none";

}

});

if(currentAnswer.style.display==="block"){

currentAnswer.style.display="none";

}else{

currentAnswer.style.display="block";

}

});

});
