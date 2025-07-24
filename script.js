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
const profileSVG = document.querySelector(".profile > svg");
const body = document.querySelector('body');

profile.addEventListener("click", () => {
  profile.style.width = "calc(100vw - 55px)";
  profile.style.height = "60vh";
  profile.style.backgroundColor = "rgb(206, 212, 218)";
  profile.classList.add('box');
  body.style.backgroundColor = 'rgba(0,0,0,0.5) !important';

  profileSVG.style.width = "calc(100vw - 80px)";
  profileSVG.style.height = "60vh";
  profileSVG.style.transform = "rotate(180deg)";

  setTimeout(() => {
    profileSVG.style.transform = "rotate(360deg)";
  }, 1000);
});
