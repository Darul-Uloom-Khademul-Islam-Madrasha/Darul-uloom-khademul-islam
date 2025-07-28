// GET from local repo's data.json file on window.load

window.onload = () => {
  fetch("./data.json")
    .then((res) => res.json())
    .then((data) => {
      for (let i = 0; Object.entries(data).length > i; i++) {
        if (Object.entries(data)[i][1].length > 5) {
          document.querySelector(".quote__header").innerHTML =
            data.quote__header;
          document.querySelector(".quote__lead").innerHTML = data.quote__lead;
          document.querySelector(".quote__text").innerHTML = data.quote__text;
          document.querySelector(".quote__ref").innerHTML = data.quote__ref;
        }
      }
    })
    .catch((error) => console.log("Fetch error: ", error));
};

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

// on Submitting a profile
const editorLogger = document.querySelector(".editor p span");
const editor = document.querySelector(".editor");
const editorLog = document.querySelector(".editor div");
const signOutPrompt = document.querySelector(".signOutPrompt");
const submitBtn = document.querySelector('.btn[type="submit"]');
const inputEmail = document.querySelector('input[type="email"]');
const inputPass = document.querySelector('input[name="password"]');
const profileNotice = document.querySelector(".profileNotice");
const quoteEditor = document.querySelector(".quoteEditor");
const quoteEditorWindow = document.querySelector(".quoteEditorWindow");
const profiles = {
  email: [
    "khadimulislammadrasa5.com",
    "alaminkhan00710@gmail.com",
    "code.islah@gmail.com",
  ],
  password: ["dukim1969", "password123", "password456"],
};

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();

  if (inputEmail.value === "" || inputPass.value === "") {
    inputEmail.style.outline = "3px solid crimson";
    inputPass.style.outline = "3px solid crimson";
    inputEmail.style.animation = "warning 1s ease-out infinite";
    inputPass.style.animation = "warning 1s ease-out infinite";

    setTimeout(() => {
      inputEmail.style.outline = "";
      inputPass.style.outline = "";
      inputEmail.style.animation = "";
      inputPass.style.animation = "";
    }, 1000);
  } else if (
    profiles.email.includes(inputEmail.value) &&
    profiles.password.includes(inputPass.value) &&
    profiles.email.indexOf(inputEmail.value) ===
      profiles.password.indexOf(inputPass.value)
  ) {
    signIn();
  } else {
    invaildUser();
  }
});

function signIn() {
  notice(0, "rgba(68, 167, 68, 1)", "fadeIn 500ms linear");
  displayTrue(profileNotice);
  quoteEditor.style.display = "grid";
  editor.style.display = "flex";
  editorLogger.innerHTML = `- ${inputEmail.value}`;
  profileSVG.classList.add("remove-pointer");
  setTimeout(() => {
    displayFalse(profileNotice, profileFormWrapper);
    profile.classList.remove("toggleProfile");
    profileSVG.innerHTML = `<svg fill="rgba(68, 167, 68, 1)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. --><path d="M399 384.2C376.9 345.8 335.4 320 288 320l-64 0c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z"/></svg>`;
  }, 1000);
}

function invaildUser() {
  notice(1, "crimson", "fadeIn 500ms linear");
  displayTrue(profileNotice);
  setInterval(() => {
    displayFalse(profileNotice);
  }, 1000);
}

function signOut() {
  const YES = document.querySelector(".signOutPrompt *:nth-child(2)");
  const NO = document.querySelector(".signOutPrompt *:nth-child(3)");

  signOutPrompt.style.display = "flex";

  YES.addEventListener("click", () => {
    notice(2, "rgba(68, 167, 68, 1)", "fadeIn 500ms linear");
    displayTrue(profileNotice);
    profileSVG.classList.remove("remove-pointer");

    setTimeout(() => {
      displayFalse(profileNotice, editor, quoteEditor, signOutPrompt);
      profileSVG.innerHTML = `<svg fill="gray" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. --><path d="M399 384.2C376.9 345.8 335.4 320 288 320l-64 0c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z"/></svg>`;
    }, 1000);
  });

  NO.addEventListener("click", () => {
    displayFalse(signOutPrompt);
  });
}

function displayTrue(...elem) {
  elem.forEach((e) => {
    e.style.display = "block";
  });
}

function displayFalse(...elem) {
  elem.forEach((e) => {
    e.style.display = "none";
  });
}

function notice(inner, bg, animation) {
  const logText = ["Log In Succcessful", "No User Found", "Singed Out"];
  profileNotice.innerHTML = logText[inner];
  profileNotice.style.background = bg;
  profileNotice.style.animation = animation;

  setTimeout(() => {
    profileNotice.style.animation = "";
  }, 1000);
}

function displayToggler() {
  quoteEditorWindow.classList.toggle("d-none");
  quoteEditor.classList.toggle("action");
}

// show/hide password
function showHide() {
  if (inputPass.type === "password") {
    inputPass.type = "text";
  } else {
    inputPass.type = "password";
  }
}

// editor setup

const editor__signOut = document.querySelector(".editor__signOut");
const editor__info = document.querySelector(".editor__info");

editor__signOut.addEventListener("click", () => {
  signOut();
});

quoteEditor.addEventListener("click", () => {
  displayToggler();
});

editor__info.addEventListener("click", () => {
  const current = editorLog.getAttribute("data-log");
  const content = `${inputEmail.value} \n ${inputPass.value}`;
  editorLog.classList.toggle("active");

  if (current === content) {
    editorLog.setAttribute("data-log", "");
  } else {
    editorLog.setAttribute("data-log", content);
  }
});

// POST & GET for updateJSON

document.getElementById("jsonForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const response = await fetch("/.netlify/functions/updateJson", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      quote__header: document.getElementById("quote__header").value,
      quote__lead: document.getElementById("quote__lead").value,
      quote__text: document.getElementById("quote__text").value,
      quote__ref: document.getElementById("quote__ref").value,
    }),
  });
  alert(await response.text());
});



