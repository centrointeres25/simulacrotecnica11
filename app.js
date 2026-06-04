// ══════════════════════════════════════════
//  SABER 11 SIMULACRO — app.js
//  Firebase Auth (Google) + Firestore
// ══════════════════════════════════════════

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ── Configuración Firebase ─────────────────
const firebaseConfig = {
  apiKey:            "AIzaSyBP5uJiq8oteVr9aRog5CVJEEPhDEKmEi0",
  authDomain:        "saber11-simulacro.firebaseapp.com",
  projectId:         "saber11-simulacro",
  storageBucket:     "saber11-simulacro.firebasestorage.app",
  messagingSenderId: "200980492866",
  appId:             "1:200980492866:web:2c643ac5116cbfd967f3db"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// ══════════════════════════════════════════
//  MAPA DE PREGUNTAS POR MATERIA
//  Basado en el PDF Saber 11 2025-2 Primera Sesión
// ══════════════════════════════════════════
const SUBJECTS = {
  matematicas: { label: "🔢 Matemáticas",          range: [1,  25],  color: "#1a73e8" },
  lectura:     { label: "📖 Lectura Crítica",       range: [26, 66],  color: "#e8710a" },
  sociales:    { label: "🌎 Sociales y Ciudadanas", range: [67, 91],  color: "#34a853" },
  ciencias:    { label: "🔬 Ciencias Naturales",    range: [92, 120], color: "#9c27b0" }
};

// ── Respuestas correctas ───────────────────
// Formato: índice = número de pregunta (1-120)
// Fuente: archivo Saber11_2025_Respuestas_Explicaciones.docx
const ANSWERS = {
   1:"B",  2:"B",  3:"D",  4:"D",  5:"B",  6:"A",  7:"B",  8:"C",  9:"D", 10:"C",
  11:"B", 12:"C", 13:"D", 14:"C", 15:"B", 16:"B", 17:"D", 18:"B", 19:"A", 20:"A",
  21:"C", 22:"A", 23:"B", 24:"C", 25:"A", 26:"D", 27:"D", 28:"A", 29:"A", 30:"C",
  31:"A", 32:"D", 33:"A", 34:"A", 35:"D", 36:"C", 37:"B", 38:"D", 39:"B", 40:"C",
  41:"B", 42:"B", 43:"C", 44:"D", 45:"C", 46:"C", 47:"B", 48:"B", 49:"B", 50:"C",
  51:"D", 52:"B", 53:"D", 54:"B", 55:"B", 56:"B", 57:"C", 58:"A", 59:"C", 60:"C",
  61:"C", 62:"C", 63:"B", 64:"B", 65:"B", 66:"B", 67:"D", 68:"B", 69:"A", 70:"D",
  71:"D", 72:"C", 73:"A", 74:"C", 75:"B", 76:"A", 77:"A", 78:"B", 79:"A", 80:"D",
  81:"B", 82:"A", 83:"C", 84:"B", 85:"D", 86:"B", 87:"B", 88:"C", 89:"D", 90:"A",
  91:"C", 92:"C", 93:"D", 94:"D", 95:"B", 96:"D", 97:"D", 98:"A", 99:"A",100:"A",
 101:"A",102:"C",103:"B",104:"C",105:"A",106:"C",107:"C",108:"A",109:"C",110:"A",
 111:"C",112:"C",113:"B",114:"D",115:"C",116:"D",117:"D",118:"D",119:"D",120:"B"
};

// ⚠️  IMPORTANTE: estas respuestas son PLACEHOLDER.
//     Debes reemplazarlas con las del archivo .docx que subiste.
//     Edita el objeto ANSWERS arriba con los valores correctos.

// ══════════════════════════════════════════
//  ESTADO GLOBAL
// ══════════════════════════════════════════
let currentUser  = null;
let mode         = "simulacro";   // "simulacro" | "practica"
let questions    = [];            // array de números de pregunta seleccionados
let currentIndex = 0;
let userAnswers  = {};            // { numPregunta: "A"|"B"|"C"|"D"|null }
let timerInterval = null;
let secondsElapsed = 0;

// ══════════════════════════════════════════
//  HELPERS DE PANTALLA
// ══════════════════════════════════════════
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// ══════════════════════════════════════════
//  FIREBASE AUTH
// ══════════════════════════════════════════
onAuthStateChanged(auth, user => {
  if (user) {
    currentUser = user;
    document.getElementById("user-avatar").src = user.photoURL || "";
    document.getElementById("user-name").textContent = user.displayName || user.email;
    guardarUsuario(user);
    showScreen("screen-menu");
  } else {
    currentUser = null;
    showScreen("screen-login");
  }
});

document.getElementById("btn-google").addEventListener("click", async () => {
  const provider = new GoogleAuthProvider();
  try { await signInWithPopup(auth, provider); }
  catch (e) { alert("Error al iniciar sesión: " + e.message); }
});

document.getElementById("btn-logout").addEventListener("click", () => signOut(auth));

async function guardarUsuario(user) {
  try {
    await setDoc(doc(db, "usuarios", user.uid), {
      nombre:       user.displayName,
      email:        user.email,
      foto:         user.photoURL,
      ultimoAcceso: serverTimestamp()
    }, { merge: true });
  } catch(e) { console.warn("Firestore:", e.message); }
}

// ══════════════════════════════════════════
//  MENÚ: SELECCIÓN DE MODO Y MATERIA
// ══════════════════════════════════════════
let selectedMode     = "simulacro";
let selectedSubjects = new Set(["matematicas","lectura","sociales","ciencias"]);

// Tarjetas de modo
document.getElementById("card-simulacro").addEventListener("click", () => {
  selectedMode = "simulacro";
  document.getElementById("card-simulacro").classList.add("selected");
  document.getElementById("card-practica").classList.remove("selected");
});
document.getElementById("card-practica").addEventListener("click", () => {
  selectedMode = "practica";
  document.getElementById("card-practica").classList.add("selected");
  document.getElementById("card-simulacro").classList.remove("selected");
});
document.getElementById("card-simulacro").classList.add("selected");

// Chips de materia
document.querySelectorAll(".subject-chip").forEach(chip => {
  chip.addEventListener("click", () => {
    const val = chip.querySelector("input").value;
    if (selectedSubjects.has(val)) {
      if (selectedSubjects.size === 1) return; // al menos una
      selectedSubjects.delete(val);
      chip.classList.remove("selected");
    } else {
      selectedSubjects.add(val);
      chip.classList.add("selected");
    }
  });
});

document.getElementById("btn-select-all").addEventListener("click", () => {
  const allSelected = selectedSubjects.size === 4;
  if (allSelected) {
    selectedSubjects = new Set(["matematicas"]);
    document.querySelectorAll(".subject-chip").forEach((c,i) => {
      if (i === 0) c.classList.add("selected"); else c.classList.remove("selected");
    });
  } else {
    selectedSubjects = new Set(["matematicas","lectura","sociales","ciencias"]);
    document.querySelectorAll(".subject-chip").forEach(c => c.classList.add("selected"));
  }
});

// ── Botón Comenzar ─────────────────────────
document.getElementById("btn-start").addEventListener("click", startExam);

function buildQuestionList() {
  const list = [];
  selectedSubjects.forEach(subj => {
    const [from, to] = SUBJECTS[subj].range;
    for (let n = from; n <= to; n++) list.push(n);
  });
  list.sort((a,b) => a - b);
  return list;
}

function getSubjectForQ(n) {
  for (const [key, data] of Object.entries(SUBJECTS)) {
    if (n >= data.range[0] && n <= data.range[1]) return key;
  }
  return "matematicas";
}

// ══════════════════════════════════════════
//  EXAMEN
// ══════════════════════════════════════════
function startExam() {
  mode      = selectedMode;
  questions = buildQuestionList();
  if (questions.length === 0) return;

  currentIndex  = 0;
  userAnswers   = {};
  secondsElapsed = 0;

  showScreen("screen-exam");
  renderQuestion();
  startTimer();

  // Mostrar / ocultar botón "Terminar" según modo
  document.getElementById("btn-finish").style.display =
    mode === "simulacro" ? "block" : "none";
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    secondsElapsed++;
    const m = String(Math.floor(secondsElapsed/60)).padStart(2,"0");
    const s = String(secondsElapsed%60).padStart(2,"0");
    const el = document.getElementById("exam-timer");
    el.textContent = `${m}:${s}`;
  }, 1000);
}

function renderQuestion() {
  const qNum = questions[currentIndex];
  const subj = getSubjectForQ(qNum);

  // Etiqueta materia
  const tag = document.getElementById("exam-subject-label");
  tag.textContent = SUBJECTS[subj].label;
  tag.className   = `subject-tag ${subj}`;

  // Número y progreso
  document.getElementById("question-number").textContent =
    `Pregunta ${qNum}  •  ${SUBJECTS[subj].label.replace(/^.{2}/,"")}`;
  document.getElementById("exam-progress-text").textContent =
    `${currentIndex + 1} / ${questions.length}`;

  // Barra de progreso
  const pct = ((currentIndex + 1) / questions.length) * 100;
  document.getElementById("progress-bar-fill").style.width = pct + "%";

  // Imagen — nombres: pregunta_01.jpg … pregunta_120.jpg
  const pad = n => n < 10 ? "0" + n : "" + n;
  const imgEl  = document.getElementById("question-img");
  const loader = document.getElementById("img-loading");
  imgEl.style.opacity = "0";
  loader.style.display = "block";
  imgEl.src = `pregunta_${pad(qNum)}.jpg`;
  imgEl.onload  = () => { imgEl.style.opacity="1"; loader.style.display="none"; };
  imgEl.onerror = () => { loader.textContent="⚠️ Imagen no disponible"; };

  // Opciones
  const grid = document.getElementById("options-grid");
  grid.querySelectorAll(".option-btn").forEach(btn => {
    const v = btn.dataset.val;
    btn.className = "option-btn";
    if (userAnswers[qNum] === v) btn.classList.add("selected");
    btn.disabled = false;

    // En modo práctica con respuesta dada: mostrar resultado
    if (mode === "practica" && userAnswers[qNum]) {
      btn.disabled = true;
      if (v === ANSWERS[qNum]) btn.classList.add("correct");
      if (v === userAnswers[qNum] && v !== ANSWERS[qNum]) btn.classList.add("wrong");
    }
  });

  // Feedback (práctica)
  const fb = document.getElementById("feedback-box");
  if (mode === "practica" && userAnswers[qNum]) {
    const ok = userAnswers[qNum] === ANSWERS[qNum];
    fb.style.display = "block";
    fb.className = `feedback-box ${ok ? "correct" : "wrong"}`;
    fb.innerHTML = ok
      ? `✅ <strong>¡Correcto!</strong> La respuesta es <strong>${ANSWERS[qNum]}</strong>.`
      : `❌ Tu respuesta fue <strong>${userAnswers[qNum]}</strong>. La correcta es <strong>${ANSWERS[qNum]}</strong>.`;
  } else {
    fb.style.display = "none";
    fb.className = "feedback-box";
  }

  // Navegación
  document.getElementById("btn-prev").disabled = currentIndex === 0;
  const isLast = currentIndex === questions.length - 1;
  document.getElementById("btn-next").textContent = isLast ? "Finalizar →" : "Siguiente →";
}

// Responder
document.getElementById("options-grid").addEventListener("click", e => {
  const btn = e.target.closest(".option-btn");
  if (!btn || btn.disabled) return;
  const qNum = questions[currentIndex];

  if (mode === "simulacro") {
    userAnswers[qNum] = btn.dataset.val;
    document.querySelectorAll(".option-btn").forEach(b => {
      b.classList.toggle("selected", b.dataset.val === btn.dataset.val);
    });
  } else {
    // Práctica: responder y bloquear
    userAnswers[qNum] = btn.dataset.val;
    renderQuestion(); // re-render para mostrar feedback
  }
});

// Navegación
document.getElementById("btn-next").addEventListener("click", () => {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    renderQuestion();
  } else {
    finishExam();
  }
});
document.getElementById("btn-prev").addEventListener("click", () => {
  if (currentIndex > 0) { currentIndex--; renderQuestion(); }
});

// Terminar simulacro manualmente
document.getElementById("btn-finish").addEventListener("click", () => {
  if (confirm("¿Terminar el simulacro y ver resultados?")) finishExam();
});

// Salir del examen
document.getElementById("btn-exit-exam").addEventListener("click", () => {
  if (confirm("¿Salir del examen? Tu progreso se perderá.")) {
    clearInterval(timerInterval);
    showScreen("screen-menu");
  }
});

// ══════════════════════════════════════════
//  RESULTADOS
// ══════════════════════════════════════════
function finishExam() {
  clearInterval(timerInterval);
  showScreen("screen-results");
  renderResults();
  saveProgress();
}

function renderResults() {
  let totalCorrect = 0;
  const bySubject = {};

  // Inicializar materias seleccionadas
  selectedSubjects.forEach(s => { bySubject[s] = { correct: 0, total: 0 }; });

  questions.forEach(qNum => {
    const subj = getSubjectForQ(qNum);
    if (!bySubject[subj]) bySubject[subj] = { correct:0, total:0 };
    bySubject[subj].total++;
    const ans = userAnswers[qNum];
    if (ans && ans === ANSWERS[qNum]) {
      totalCorrect++;
      bySubject[subj].correct++;
    }
  });

  const pct = Math.round((totalCorrect / questions.length) * 100);

  // Círculo
  const circle = document.getElementById("results-circle");
  document.getElementById("results-pct").textContent = pct + "%";
  circle.className = "results-score-circle " +
    (pct >= 70 ? "good" : pct >= 50 ? "medium" : "low");

  // Título y resumen
  const emojis = pct >= 70 ? "🏆" : pct >= 50 ? "📚" : "💪";
  document.getElementById("results-title").textContent =
    emojis + " " + (pct >= 70 ? "¡Excelente resultado!" : pct >= 50 ? "Buen esfuerzo" : "Sigue practicando");
  document.getElementById("results-summary").textContent =
    `Respondiste correctamente ${totalCorrect} de ${questions.length} preguntas en ${formatTime(secondsElapsed)}.`;

  // Por materia
  const bySubjEl = document.getElementById("results-by-subject");
  bySubjEl.innerHTML = "";
  Object.entries(bySubject).forEach(([key, data]) => {
    const subjPct = data.total > 0 ? Math.round((data.correct/data.total)*100) : 0;
    const card = document.createElement("div");
    card.className = "subject-result-card";
    card.innerHTML = `
      <h4>${SUBJECTS[key].label}</h4>
      <div class="result-bar-bg">
        <div class="result-bar-fill" style="width:${subjPct}%;background:${SUBJECTS[key].color}"></div>
      </div>
      <div class="result-fraction">${data.correct}/${data.total} correctas (${subjPct}%)</div>
    `;
    bySubjEl.appendChild(card);
  });

  // Revisión de preguntas
  const reviewEl = document.getElementById("review-list");
  reviewEl.innerHTML = "";
  const pad = n => n < 10 ? "0" + n : "" + n;

  questions.forEach(qNum => {
    const ans     = userAnswers[qNum] || null;
    const correct = ANSWERS[qNum];
    const status  = !ans ? "skipped" : ans === correct ? "correct" : "wrong";

    const item = document.createElement("div");
    item.className = `review-item ${status}`;

    let answersHTML = "";
    if (status === "correct") {
      answersHTML = `<span class="ans-label ans-ok">✓ ${ans}</span>`;
    } else if (status === "wrong") {
      answersHTML = `
        <span class="ans-label ans-yours">Tu respuesta: ${ans}</span>
        <span class="ans-label ans-correct">Correcta: ${correct}</span>`;
    } else {
      answersHTML = `<span class="ans-label ans-yours">Sin responder</span>
        <span class="ans-label ans-correct">Correcta: ${correct}</span>`;
    }

    item.innerHTML = `
      <img class="review-q-img"
           src="pregunta_${pad(qNum)}.jpg"
           alt="Pregunta ${qNum}"
           onerror="this.style.display='none'"/>
      <div class="review-info">
        <div class="review-num">Pregunta ${qNum} — ${SUBJECTS[getSubjectForQ(qNum)].label}</div>
        <div class="review-answers">${answersHTML}</div>
      </div>
    `;
    reviewEl.appendChild(item);
  });
}

async function saveProgress() {
  if (!currentUser) return;
  try {
    await setDoc(doc(db, "usuarios", currentUser.uid, "progreso",
      new Date().toISOString().replace(/[:.]/g,"-")), {
      fecha:      serverTimestamp(),
      modo:       mode,
      materias:   [...selectedSubjects],
      total:      questions.length,
      correctas:  Object.values(userAnswers).filter((a,i) => a === ANSWERS[questions[i]]).length,
      tiempo:     secondsElapsed,
      respuestas: userAnswers
    });
  } catch(e) { console.warn("No se pudo guardar progreso:", e.message); }
}

function formatTime(secs) {
  const m = Math.floor(secs/60), s = secs % 60;
  return `${m}m ${s}s`;
}

// Botones de resultados
document.getElementById("btn-retry").addEventListener("click", startExam);
document.getElementById("btn-back-menu").addEventListener("click", () => showScreen("screen-menu"));
