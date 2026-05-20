const textInput = document.getElementById("textInput");
const translated = document.getElementById("translated");
const fromLang = document.getElementById("fromLang");
const toLang = document.getElementById("toLang");

let timeout;

/* АВТОПЕРЕВОД */
textInput.addEventListener("input", () => {

clearTimeout(timeout);

const text = textInput.value.trim();

if (!text) {
translated.innerText = "Перевод появится здесь...";
return;
}

timeout = setTimeout(() => {
translate(text);
}, 500);

});

/* ПЕРЕВОД (СТАБИЛЬНЫЙ) */
async function translate(text) {

translated.innerText = "Перевод...";

try {

const url =
`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang.value}|${toLang.value}`;

const res = await fetch(url);

// если нет интернета или API упал
if (!res.ok) {
translated.innerText = text;
return;
}

const data = await res.json();

// проверка ответа
const result = data?.responseData?.translatedText;

if (!result || result.trim() === "") {
translated.innerText = text;
return;
}

// вывод результата
translated.innerText = result;

} catch (e) {

// если вообще всё сломалось
translated.innerText = text;

}

}

/* МИКРОФОН */
const SpeechRecognition =
window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition;

if (SpeechRecognition) {
recognition = new SpeechRecognition();

recognition.continuous = false;

document.getElementById("mic").onclick = () => {
recognition.lang = fromLang.value === "ru" ? "ru-RU" : "en-US";
recognition.start();
};

recognition.onresult = (event) => {
const text = event.results[0][0].transcript;
textInput.value = text;
translate(text);
};
}

/* ОЗВУЧКА */
document.getElementById("speak").onclick = () => {

const text = translated.innerText;

if (!text || text === "Перевод появится здесь...") return;

const speech = new SpeechSynthesisUtterance(text);

speech.lang = toLang.value === "ru" ? "ru-RU" : "en-US";

speech.rate = 1;
speech.pitch = 1;

speechSynthesis.speak(speech);

};

/* КОПИРОВАНИЕ */
document.getElementById("copy").onclick = () => {
navigator.clipboard.writeText(translated.innerText);
};

/* ОЧИСТКА */
document.getElementById("clear").onclick = () => {
textInput.value = "";
translated.innerText = "Перевод появится здесь...";
};

/* СМЕНА ЯЗЫКОВ */
document.getElementById("swap").onclick = () => {

let temp = fromLang.value;
fromLang.value = toLang.value;
toLang.value = temp;

let tempText = textInput.value;
textInput.value = translated.innerText;
translated.innerText = tempText;

if (textInput.value.trim()) {
translate(textInput.value);
}

};