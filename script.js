const theme = document.querySelector("#theme");
const menuBtn = document.querySelector(".nav h2 svg");
const menu = document.querySelector(".mainNav");

theme.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
});

menuBtn.addEventListener("click", () => {
  if (menu.style.display === "block") {
    menu.style.display = "none";
  } else {
    menu.style.animation = "slideDown .5s linear";
    menu.style.display = "block";
  }
});

// on submit

const submit = document.querySelector(".submit");
const reset = document.querySelector(".reset");
const process = document.querySelector(".process");
const processing = document.querySelector(".processing");

processing.classList.remove("processing");

submit.addEventListener("click", () => {
  processing.classList.add("processing");
  process.classList.remove("process");

  // text entry
  const textEntry = document.querySelector(".text-entry");
  let count = -1;
  let text = "Please wait...";
  let temp = "";

  let int = setInterval(() => {
    count++;
    if (text.length > count) {
      temp += text[count];
    }
    textEntry.innerHTML = temp;

    if (temp.length === text.length) {
      clearInterval(int);
    }
  }, 100);

  setTimeout(() => {
    processing.classList.remove("processing");
    textEntry.innerHTML = "";
  }, 2000);
});

reset.addEventListener("click", () => {
  processing.classList.add("process");
});


// selection reference

const year = document.querySelector('.year');
const __class = document.querySelector('.class');