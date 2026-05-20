document.addEventListener("DOMContentLoaded", () => {

  const textInput = document.getElementById("textInput");
  const translated = document.getElementById("translated");
  const fromLang = document.getElementById("fromLang");
  const toLang = document.getElementById("toLang");

  let timeout;

  // AUTO TRANSLATE
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

  // TRANSLATE FUNCTION
  async function translate(text) {
    translated.innerText = "Перевод...";

    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang.value}|${toLang.value}`;

      const res = await fetch(url);
      const data = await res.json();

      const result = data?.responseData?.translatedText;

      translated.innerText = result || text;

    } catch (e) {
      translated.innerText = text;
    }
  }

  // MIC
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (SpeechRecognition) {
    const recognition = new SpeechRecognition();

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

  // SPEAK
  document.getElementById("speak").onclick = () => {
    const text = translated.innerText;

    if (!text || text.includes("Перевод")) return;

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = toLang.value === "ru" ? "ru-RU" : "en-US";
    speech.rate = 1;

    speechSynthesis.speak(speech);
  };

  // COPY
  document.getElementById("copy").onclick = () => {
    navigator.clipboard.writeText(translated.innerText);
  };

  // CLEAR
  document.getElementById("clear").onclick = () => {
    textInput.value = "";
    translated.innerText = "Перевод появится здесь...";
  };

  // SWAP LANG
  document.getElementById("swap").onclick = () => {
    [fromLang.value, toLang.value] = [toLang.value, fromLang.value];

    const temp = textInput.value;
    textInput.value = translated.innerText;
    translated.innerText = temp;

    if (textInput.value.trim()) {
      translate(textInput.value);
    }
  };

});