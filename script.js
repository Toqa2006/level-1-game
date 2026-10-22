
const $ = (id) => document.getElementById(id);

// Formspree: إرسال نتائج اللعبة إلى الإيميل
const FORMSPREE_URL = "https://formspree.io/f/maeewvql";

const startScreen = $("start-screen");
const quizScreen = $("quiz-screen");
const resultScreen = $("result-screen");

const startBtn = $("start-btn");
const nextBtn = $("next-btn");
const restartBtn = $("restart-btn");

const questionTitle = $("question-title");
const questionEmoji = $("question-emoji");
const questionHint = $("question-hint");
const answerArea = $("answer-area");
const feedback = $("feedback");

const questionNumber = $("question-number");
const progressBar = $("progress-bar");
const progressFill = $("progress-fill");

const resultEmoji = $("result-emoji");
const resultTitle = $("result-title");
const resultMessage = $("result-message");
const resultName = $("result-name");
const resultMajor = $("result-major");
const resultScore = $("result-score");

const scoredQuestions = 4;

let current = 0;
let score = 0;
let selectedAnswer = "";
let emailSentForThisRound = false;

let player = {
    name: "",
    major: "",
    answers: []
};

const questions = [
    {
        type: "text",
        key: "name",
        emoji: "👋",
        title: "شو اسمك يا أسطورة الـ TLE؟",
        hint: "اكتب اسمك الحقيقي، مش اسم Codeforces 😂",
        placeholder: "اكتب اسمك هون..."
    },
    {
        type: "text",
        key: "major",
        emoji: "🎓",
        title: "شو تخصصك وكليتك؟",
        hint: "بدنا نعرف مين انضم لعصابة المبرمجين 😎",
        placeholder: "مثلاً: Computer Science - كلية تكنولوجيا المعلومات"
    },
    {
        type: "choice",
        scored: true,
        emoji: "🏫",
        title: "شو اسم أكاديميتنا؟",
        hint: "ركز، هاي أول معلومة لازم تحفظها!",
        options: [
            { text: "Code Academy 💚", correct: true },
            { text: "Code Coffee ☕", correct: false },
            { text: "Academy of Sleeping 😴", correct: false },
            { text: "TLE University 😭", correct: false }
        ]
    },
    {
        type: "choice",
        emoji: "🤔",
        title: "ليش سجلت في تدريبنا؟",
        hint: "جاوب بصراحة، ما في علامات على السؤال 😂",
        options: [
            { text: "عشان أصير مبرمج أقوى 💻" },
            { text: "عشان أحل المسائل والمسابقات 🧠" },
            { text: "عشان أتعلم وأطور نفسي 🚀" },
            { text: "كل ما سبق... ومعهم شوية حماس 😂" }
        ]
    },
    {
        type: "choice",
        scored: true,
        emoji: "🌐",
        title: "شو اسم الموقع اللي رح نتدرب عليه؟",
        hint: "الموقع اللي ممكن يخليك تحكي: ليش فتحت السؤال أصلاً؟ 😭",
        options: [
            { text: "Codeforces 💻", correct: true },
            { text: "Instagram 📸", correct: false },
            { text: "Foodforces 🍕", correct: false },
            { text: "Sleepforces 🛌", correct: false }
        ]
    },
    {
        type: "choice",
        scored: true,
        emoji: "🇵🇸",
        title: "شو اسم المسابقة الفلسطينية للبرمجة التنافسية لطلاب الجامعات؟",
        hint: "اختصارها PCPC 👀",
        options: [
            {
                text: "Palestinian Collegiate Programming Contest (PCPC)",
                correct: true
            },
            {
                text: "Palestinian Coffee Programming Club ☕",
                correct: false
            },
            {
                text: "Programming Cats Championship 🐱",
                correct: false
            },
            {
                text: "Palestinian Pizza Cooking Contest 🍕",
                correct: false
            }
        ]
    },
    {
        type: "math",
        scored: true,
        emoji: "🧮",
        title: "سؤال حساب سريع: كم ناتج 7 × 8؟",
        hint: "ممنوع الآلة الحاسبة يا بطل 😏",
        placeholder: "اكتب الناتج...",
        answer: 56
    },
    {
        type: "choice",
        emoji: "🎉",
        title: "حلّيت المسألة من أول محاولة، شو بتعمل؟",
        hint: "تخيّل إن الـ Accepted ظهر قدامك 💚",
        options: [
            { text: "أحتفل كأني فزت بالـ ICPC 🏆" },
            { text: "أراجع الحل وأفهمه منيح 🧠" },
            { text: "أبعت Screenshot لكل الجروبات 😂" },
            { text: "كلهم مع بعض! 🥳" }
        ]
    },
    {
        type: "choice",
        emoji: "🌈",
        title: "شو أحلى لون على Codeforces؟",
        hint: "سؤال مصيري جداً... تقريباً 😌",
        options: [
            { text: "Newbie — رمادي 🩶" },
            { text: "Pupil — أخضر 💚" },
            { text: "Specialist — سماوي 🩵" },
            { text: "Expert — أزرق 💙" },
            { text: "Grandmaster — أحمر ❤️" },
            { text: "اللون اللي لسه رح أوصله 😎" }
        ]
    },
    {
        type: "choice",
        emoji: "😭",
        title: "طلعلك Wrong Answer للمرة العاشرة، شو خطتك؟",
        hint: "اختار ردّة فعلك الحقيقية 😂",
        options: [
            { text: "أراجع الحالات الخاصة وأفحص الحل 🔍" },
            { text: "ألوم الـ compiler شوي 😭" },
            { text: "أجرب test case جديد 🧪" },
            { text: "أعمل كل هالأشياء وبكمل 💪" }
        ]
    },
    {
        type: "choice",
        emoji: "🚀",
        title: "لو خلص التدريب، شو ناوي تعمل؟",
        hint: "المشوار لسه بأوله يا بطل!",
        options: [
            { text: "أكمل وأشارك بالمسابقات 🏆" },
            { text: "أقوي حالي بحل مسائل أكثر 💻" },
            { text: "أطور مشاريعي البرمجية ✨" },
            { text: "كلهم، ما دام بلشنا ما بنوقف 😎" }
        ]
    },
    {
        type: "choice",
        emoji: "👑",
        title: "آخر سؤال: جاهز تصير Problem Solver؟",
        hint: "بدنا نختمها ختمة قوية 🔥",
        options: [
            { text: "جاهز، يلا على المسائل! 🚀" },
            { text: "جاهز... بس وين القهوة؟ ☕" },
            { text: "جاهز، حتى لو الـ TLE صار صاحبي 😂" }
        ]
    }
];

// معالجة الشعار إذا لم يتم تحميل الصورة
function setupLogo(img) {
    if (!img) return;

    img.addEventListener("error", () => {
        const fallback = document.createElement("div");
        fallback.className = "logo-fallback";
        fallback.innerHTML =
            '<span class="fallback-icon">💻</span><span>Code Academy</span>';

        img.replaceWith(fallback);
    }, { once: true });
}

document.querySelectorAll(".brand-logo, .main-logo").forEach(setupLogo);

// التنقل بين صفحات اللعبة
function showScreen(screen) {
    startScreen.classList.add("hidden");
    quizScreen.classList.add("hidden");
    resultScreen.classList.add("hidden");

    screen.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// تحديث شريط التقدم
function updateProgress() {
    const percent = (current / questions.length) * 100;

    if (questionNumber) {
        questionNumber.textContent =
            `${Math.min(current + 1, questions.length)} / ${questions.length}`;
    }

    if (progressFill) {
        progressFill.style.width = `${percent}%`;
    }

    if (progressBar) {
        progressBar.setAttribute("aria-valuenow", String(percent));
    }
}

// عرض السؤال الحالي
function renderQuestion() {
    const q = questions[current];

    selectedAnswer = "";
    answerArea.innerHTML = "";
    feedback.textContent = "";
    nextBtn.disabled = true;

    questionTitle.textContent = q.title;
    questionEmoji.textContent = q.emoji;
    questionHint.textContent = q.hint;

    nextBtn.innerHTML = current === questions.length - 1
        ? 'عرض النتيجة 🏆 <span>←</span>'
        : 'السؤال التالي <span>←</span>';

    updateProgress();

    if (q.type === "text" || q.type === "math") {
        const input = document.createElement("input");

        input.type = q.type === "math" ? "number" : "text";
        input.className = "answer-input";
        input.placeholder = q.placeholder || "";
        input.autocomplete = q.type === "text" ? "off" : "on";
        input.setAttribute("aria-label", q.title);

        input.addEventListener("input", () => {
            selectedAnswer = input.value.trim();
            nextBtn.disabled = selectedAnswer.length === 0;
        });

        input.addEventListener("keydown", (event) => {
            if (event.key === "Enter" && !nextBtn.disabled) {
                nextBtn.click();
            }
        });

        answerArea.appendChild(input);
        input.focus();
        return;
    }

    if (q.type === "choice") {
        q.options.forEach((option) => {
            const button = document.createElement("button");

            button.type = "button";
            button.className = "option";
            button.textContent = option.text;

            button.addEventListener("click", () => {
                answerArea.querySelectorAll(".option").forEach((item) => {
                    item.classList.remove("selected");
                    item.setAttribute("aria-pressed", "false");
                });

                button.classList.add("selected");
                button.setAttribute("aria-pressed", "true");

                selectedAnswer = option.text;
                nextBtn.disabled = false;
                feedback.textContent = "تم اختيار إجابتك 💚";
            });

            button.setAttribute("aria-pressed", "false");
            answerArea.appendChild(button);
        });
    }
}

// بدء اللعبة
startBtn.addEventListener("click", () => {
    current = 0;
    score = 0;
    selectedAnswer = "";
    emailSentForThisRound = false;

    player = {
        name: "",
        major: "",
        answers: []
    };

    showScreen(quizScreen);
    renderQuestion();
});

// تحويل الأرقام العربية إلى أرقام إنجليزية للمقارنة
function normalizeNumber(value) {
    const arabicDigits = "٠١٢٣٤٥٦٧٨٩";
    const persianDigits = "۰۱۲۳۴۵۶۷۸۹";

    return String(value)
        .replace(/[٠-٩]/g, (digit) => arabicDigits.indexOf(digit))
        .replace(/[۰-۹]/g, (digit) => persianDigits.indexOf(digit))
        .trim();
}

// الانتقال للسؤال التالي
nextBtn.addEventListener("click", () => {
    if (!selectedAnswer.trim()) return;

    const q = questions[current];
    let answer = selectedAnswer.trim();
    let isCorrect = null;

    if (q.type === "text") {
        player[q.key] = answer;
    }

    if (q.type === "math") {
        answer = normalizeNumber(answer);
        isCorrect = Number(answer) === q.answer;

        if (isCorrect) {
            score++;
            feedback.textContent = "إجابة صحيحة! 🔥";
        } else {
            feedback.textContent = "ولا يهمك، كمّل التحدي 💚";
        }
    } else if (q.type === "choice" && q.scored) {
        const chosenOption = q.options.find(
            (option) => option.text === answer
        );

        isCorrect = Boolean(chosenOption && chosenOption.correct);

        if (isCorrect) {
            score++;
            feedback.textContent = "إجابة صحيحة! 🔥";
        } else {
            feedback.textContent = "ولا يهمك، كمّل التحدي 💚";
        }
    }

    player.answers.push({
        question: q.title,
        answer,
        correct: q.scored ? isCorrect : null
    });

    current++;

    if (current < questions.length) {
        renderQuestion();
    } else {
        showResult();
    }
});

// عرض النتيجة
function showResult() {
    showScreen(resultScreen);

    if (progressFill) {
        progressFill.style.width = "100%";
    }

    if (progressBar) {
        progressBar.setAttribute("aria-valuenow", "100");
    }

    if (questionNumber) {
        questionNumber.textContent = `${questions.length} / ${questions.length}`;
    }

    resultName.textContent = player.name || "بطل Code Academy";
    resultMajor.textContent = player.major || "لم يتم إدخال التخصص";
    resultScore.textContent = `${score} / ${scoredQuestions}`;

    if (score === scoredQuestions) {
        resultEmoji.textContent = "🏆";
        resultTitle.textContent = "أسطورة الـ Accepted!";
        resultMessage.textContent =
            "علامة كاملة! واضح إنك جاي تكسر الدنيا 💚";
    } else if (score >= 2) {
        resultEmoji.textContent = "😎";
        resultTitle.textContent = "أبدعت يا بطل!";
        resultMessage.textContent =
            "بداية حلوة، ومع التدريب رح تصير أقوى وأقوى 🚀";
    } else {
        resultEmoji.textContent = "💪";
        resultTitle.textContent = "كلنا بنبدأ من مكان!";
        resultMessage.textContent =
            "المهم إنك بدأت، والتدريب هو طريقك للـ Accepted 💚";
    }

    sendResultByEmail();
}

// إظهار حالة إرسال النتيجة
function showEmailStatus(message, type) {
    let status = $("email-status");

    if (!status) {
        status = document.createElement("p");
        status.id = "email-status";
        status.style.margin = "12px 0";
        status.style.fontSize = "13px";
        status.style.fontWeight = "700";

        const resultMessageElement = $("result-message");
        resultMessageElement.insertAdjacentElement("afterend", status);
    }

    status.textContent = message;
    status.style.color = type === "error" ? "#c0392b" : "#078363";
}

// إرسال النتيجة إلى Formspree
async function sendResultByEmail() {
    if (emailSentForThisRound) return;

    emailSentForThisRound = true;
    showEmailStatus("جارٍ إرسال نتيجتك... ⏳", "pending");

    const answersText = player.answers.map((item, index) => {
        let answerStatus = "";

        if (item.correct === true) {
            answerStatus = " — صحيحة";
        } else if (item.correct === false) {
            answerStatus = " — خاطئة";
        } else {
            answerStatus = " — غير محسوبة ضمن العلامة";
        }

        return `${index + 1}. ${item.question}\nالإجابة: ${item.answer}${answerStatus}`;
    }).join("\n\n");

    const formData = new FormData();

    formData.append("_subject", `نتيجة Code Academy Level 1 - ${player.name}`);
    formData.append("student_name", player.name);
    formData.append("major_and_college", player.major);
    formData.append("score", `${score} / ${scoredQuestions}`);
    formData.append("answers", answersText);
    formData.append("submitted_at", new Date().toLocaleString("ar-PS"));

    try {
        const response = await fetch(FORMSPREE_URL, {
            method: "POST",
            body: formData,
            headers: {
                Accept: "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`فشل الإرسال: ${response.status}`);
        }

        showEmailStatus("تم إرسال النتيجة بنجاح 💚📩", "success");
    } catch (error) {
        console.error("Email submission error:", error);

        showEmailStatus(
            "تعذّر إرسال النتيجة. تأكدي من الإنترنت وإعدادات Formspree.",
            "error"
        );

        // السماح بمحاولة الإرسال مرة أخرى إذا فشلت المحاولة
        emailSentForThisRound = false;
    }
}

// إعادة التحدي
restartBtn.addEventListener("click", () => {
    current = 0;
    score = 0;
    selectedAnswer = "";
    emailSentForThisRound = false;

    player = {
        name: "",
        major: "",
        answers: []
    };

    const status = $("email-status");
    if (status) status.remove();

    showScreen(startScreen);
});
