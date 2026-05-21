document.addEventListener("DOMContentLoaded", () => {

  const textInput = document.getElementById("textInput");
  const translated = document.getElementById("translated");
  const fromLang = document.getElementById("fromLang");
  const toLang = document.getElementById("toLang");

  let timeout;

  // Автоперевод
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

  // Функция перевода
  async function translate(text) {

    translated.innerText = "Перевод...";

    try {

      const url =
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang.value}|${toLang.value}`;

      const res = await fetch(url);

      const data = await res.json();

      translated.innerText =
        data?.responseData?.translatedText || text;

    } catch (e) {

      translated.innerText = text;

    }

  }

  // Микрофон
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (SpeechRecognition) {

    const recognition = new SpeechRecognition();

    document.getElementById("mic").onclick = () => {

      recognition.lang =
        fromLang.value === "ru" ? "ru-RU" : "en-US";

      recognition.start();

    };

    recognition.onresult = (event) => {

      const text = event.results[0][0].transcript;

      textInput.value = text;

      translate(text);

    };

  }

  // Озвучка
  document.getElementById("speak").onclick = () => {

    const text = translated.innerText;

    if (!text || text.includes("Перевод")) return;

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang =
      toLang.value === "ru" ? "ru-RU" : "en-US";

    speechSynthesis.speak(speech);

  };

  // Копировать
  document.getElementById("copy").onclick = () => {

    navigator.clipboard.writeText(
      translated.innerText
    );

  };

  // Очистка
  document.getElementById("clear").onclick = () => {

    textInput.value = "";

    translated.innerText =
      "Перевод появится здесь...";

  };

  // Смена языков
  document.getElementById("swap").onclick = () => {

    [fromLang.value, toLang.value] =
      [toLang.value, fromLang.value];

    const temp = textInput.value;

    textInput.value = translated.innerText;

    translated.innerText = temp;

    if (textInput.value.trim()) {
      translate(textInput.value);
    }

  };

});