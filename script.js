const theme = document.querySelector("#theme");
const menuBtn = document.querySelector(".nav h2 svg");
const menu = document.querySelector(".mainNav");
const rotateSVG = document.querySelector(".rotateSVG");

theme.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
});

menuBtn.addEventListener("click", () => {
  if (menu.style.display === "block") {
    menu.style.display = "none";
    rotateSVG.style.transform = "rotate(0deg)";
  } else {
    menu.style.animation = "slideDown .5s linear";
    menu.style.display = "block";
    rotateSVG.style.transform = "rotate(270deg)";
  }
});

// on submit
const submit = document.querySelector(".submit");
const reset = document.querySelector(".reset");
const process = document.querySelector(".process");
const processing = document.querySelector(".processing");
const skChase = document.querySelector(".skChase");
const links = {
  2025: {
    mizan: "http://web1.app",
    nahubemir: "http://web2.app",
    kafiya: "http://web2.app",
    mishkat: "http://web4.app",
    jalalyn: "http://web5.app",
    takmil: "http://web6.app",
  },
};

submit.addEventListener("click", () => {
  skChase.style.display = "block";
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
    skChase.style.display = "none";
    textEntry.innerHTML = "";
  }, 2000);
  processing.classList.add("processing");

  // selection reference
  const year = document.querySelector(".year select");
  const __class = document.querySelector(".class select");
  const reference = document.querySelector(".reference");

  reference.innerHTML = `* ${__class.value} ${year.value}`;

  // result output
  const gdrive = document.querySelector(".gdrive");
  const previewPDF = document.querySelector(".previewPDF");

  for (let key in links) {
    if (year.value === key) {
      gdrive.href = links[`${year.value}`][`${__class.value.toLowerCase()}`];
      gdrive.innerHTML = "Google Drive";
      gdrive.style.pointerEvents = "auto";
      previewPDF.style.visibility = "visible";
      reference.style.color = "#1f8312";
      gdrive.parentElement.setAttribute("style", "");
    } else {
      gdrive.innerHTML = "No data found";
      gdrive.style.pointerEvents = "none";
      previewPDF.style.visibility = "hidden";
      reference.style.color = "crimson";
      gdrive.parentElement.setAttribute("style", "color: crimson; border: 0");
    }
  }
});

//reset result entry
reset.addEventListener("click", () => {
  process.classList.add("process");
});

// previewPDF
const previewPDF = document.querySelector(".previewPDF");
const PDFReader = document.querySelector(".PDFReader");
const result = document.querySelector("#result");
const close = document.querySelector(".close");

previewPDF.addEventListener("click", () => {
  PDFReader.style.display = "block";
});

close.addEventListener("click", () => {
  PDFReader.style.display = "none";
});

// scroll events

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll(".animateScroll").forEach((e) => {
  observer.observe(e);
});

// profile page

const profile = document.querySelector(".profile");
const profileFormWrapper = document.querySelector(".profileFormWrapper");
const profileSVG = document.querySelector(".profile > svg");

profileSVG.addEventListener("click", () => {
  profile.classList.toggle("toggleProfile");

  if (profileFormWrapper.style.display === "grid") {
    profileFormWrapper.style.display = "none";
    profileSVG.innerHTML = `<svg
            fill="#333"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <!-- FontAwesomeFree6.6.0by@fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. -->
            <path
              d="M406.5 399.6C387.4 352.9 341.5 320 288 320l-64 0c-53.5 0-99.4 32.9-118.5 79.6C69.9 362.2 48 311.7 48 256C48 141.1 141.1 48 256 48s208 93.1 208 208c0 55.7-21.9 106.2-57.5 143.6zm-40.1 32.7C334.4 452.4 296.6 464 256 464s-78.4-11.6-110.5-31.7c7.3-36.7 39.7-64.3 78.5-64.3l64 0c38.8 0 71.2 27.6 78.5 64.3zM256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-272a40 40 0 1 1 0-80 40 40 0 1 1 0 80zm-88-40a88 88 0 1 0 176 0 88 88 0 1 0 -176 0z"
            />
          </svg>`;
  } else {
    profileFormWrapper.style.display = "grid";
    profileSVG.innerHTML =
      '<svg fill="crimson" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. --><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"/></svg>';
  }
});
