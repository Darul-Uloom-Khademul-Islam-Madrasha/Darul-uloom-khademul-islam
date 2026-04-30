// GET from local repo's data.json file on window.load

let files = [];

window.onload = () => {
  files = grabAvailableFiles();
  
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

 function grabAvailableFiles() {
 fetch(
    "https://api.github.com/repos/Darul-Uloom-Khademul-Islam-Madrasha/Darul-uloom-khademul-islam/contents/public/results",
    {
      headers: {
        Accept: "application/vnd.github+json",
      },
    },
  )
    .then((res) => res.json())
    .then((data) => {
      const mapped = data.map((file) => {
        return file.name;
      });
      files = mapped;
    });

  return files;
}

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

// scroll events

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const animatedElements = Array.from(
  document.querySelectorAll(".animateScroll"),
);

animatedElements.forEach((element, index) => {
  element.style.setProperty("--stagger-index", index % 8);
});

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  animatedElements.forEach((element) => element.classList.add("animate"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
  );

  animatedElements.forEach((element) => {
    observer.observe(element);
  });
}

document
  .querySelectorAll(".title, .mergeNav, .quote-wrapper")
  .forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width) * 100;
      const y = ((event.clientY - bounds.top) / bounds.height) * 100;

      card.style.setProperty("--pointer-x", `${x}%`);
      card.style.setProperty("--pointer-y", `${y}%`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.removeProperty("--pointer-x");
      card.style.removeProperty("--pointer-y");
    });
  });

// profile page

const profile = document.querySelector(".profile");
const profileFormWrapper = document.querySelector(".profileFormWrapper");
const profileSVG = document.querySelector(".profile > svg");
const editorPanel = document.querySelector(".editorPanel");

let isSignedIn = false;

profileSVG.addEventListener("click", () => {
  profile.classList.toggle("toggleProfile");

  if (isSignedIn) {
    editorPanel.classList.toggle("d-none");
    profileSVG.innerHTML =
      '<svg viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>user-profile-filled</title> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="drop" fill="#fff2d4" transform="translate(42.666667, 42.666667)"> <path d="M213.333333,3.55271368e-14 C269.912851,3.55271368e-14 324.175019,22.4761259 364.18278,62.4838867 C404.190541,102.491647 426.666667,156.753816 426.666667,213.333333 C426.666667,331.15408 331.15408,426.666667 213.333333,426.666667 C95.5125867,426.666667 2.84217094e-14,331.15408 2.84217094e-14,213.333333 C2.84217094e-14,95.5125867 95.5125867,3.55271368e-14 213.333333,3.55271368e-14 Z M234.666667,234.666667 L192,234.666667 C139.18529,234.666667 93.8415802,266.653822 74.285337,312.314895 C105.229171,355.70638 155.977088,384 213.333333,384 C270.689579,384 321.437496,355.70638 352.381644,312.31198 C332.825087,266.653822 287.481377,234.666667 234.666667,234.666667 L234.666667,234.666667 Z M213.333333,64 C177.987109,64 149.333333,92.653776 149.333333,128 C149.333333,163.346224 177.987109,192 213.333333,192 C248.679557,192 277.333333,163.346224 277.333333,128 C277.333333,92.653776 248.679557,64 213.333333,64 Z"> </path> </g> </g> </g></svg>';
  }

  if (isSignedIn) return;

  if (profileFormWrapper.style.display === "grid") {
    profileFormWrapper.style.display = "none";
    profileSVG.innerHTML = `<svg
           
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
const editorUser = document.querySelector(".editor__user");
const editor = document.querySelector(".editor");
const editorDataCard = document.querySelector(".editorDataCard");
const editorDataContent = document.querySelector(".editorDataCard__content");
const signOutPrompt = document.querySelector(".signOutPrompt");
const profileForm = document.querySelector("#profileForm");
const emailInput = document.querySelector('input[type="email"]');
const passInput = document.querySelector('input[name="password"]');
const profileNotice = document.querySelector(".profileNotice");
const quoteEditor = document.querySelector(".quoteEditor");
const quoteEditorWindow = document.querySelector(".quoteEditorWindow");
const quoteEditorClose = document.querySelector(".quoteEditorWindow__close");
const signOutYes = document.querySelector(".signOutPrompt__yes");
const signOutNo = document.querySelector(".signOutPrompt__no");

profileForm.addEventListener("submit", (e) => {
  e.preventDefault();

  fetch("./users.json")
    .then((data) => data.json())
    .then((users) => {
      const inputEmail = document.querySelector('input[type="email"]').value;
      const inputPass = document.querySelector('input[name="password"]').value;
      users.forEach((v, i) => {
        if (!inputEmail || !inputPass) {
          emailInput.style.outline = "3px solid crimson";
          passInput.style.outline = "3px solid crimson";
          emailInput.style.animation = "warning 1s ease-out infinite";
          passInput.style.animation = "warning 1s ease-out infinite";

          setTimeout(() => {
            emailInput.style.outline = "";
            passInput.style.outline = "";
            emailInput.style.animation = "";
            passInput.style.animation = "";
          }, 1000);
        } else if (
          users[i].email === inputEmail &&
          users[i].password === inputPass &&
          users[i] === users[i]
        ) {
          signIn(users[i].name, users[i].role);
        } else {
          invaildUser();
        }
      });
    });
});

function signIn(name, role) {
  notice(0, "rgba(68, 167, 68, 1)", "fadeIn 500ms linear");
  displayTrue(profileNotice);

  profileFormWrapper.style.display = "none";
  isSignedIn = true;
  quoteEditor.style.display = "inline-flex";
  editor.style.display = "flex";
  editorUser.innerHTML = name + " - " + role;
  editorDataContent.textContent = `${inputEmail.value}\n${inputPass.value}`;
  editorDataCard.classList.remove("active");
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
  signOutPrompt.style.display = "flex";
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
const editor__quoteToggle = document.querySelector(".editor__quoteToggle");

editor__signOut.addEventListener("click", () => {
  signOut();
});

quoteEditor.addEventListener("click", () => {
  displayToggler();
});

if (quoteEditorClose) {
  quoteEditorClose.addEventListener("click", () => {
    displayToggler();
  });
}

if (signOutYes) {
  signOutYes.addEventListener("click", () => {
    notice(2, "rgba(68, 167, 68, 1)", "fadeIn 500ms linear");
    displayTrue(profileNotice);
    profileSVG.classList.remove("remove-pointer");

    setTimeout(() => {
      displayFalse(profileNotice, editor, quoteEditor, signOutPrompt);
      editorDataCard.classList.remove("active");
      profileSVG.innerHTML = `<svg fill="gray" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. --><path d="M399 384.2C376.9 345.8 335.4 320 288 320l-64 0c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z"/></svg>`;
    }, 1000);
  });
}

if (signOutNo) {
  signOutNo.addEventListener("click", () => {
    displayFalse(signOutPrompt);
  });
}

if (editor__quoteToggle) {
  editor__quoteToggle.addEventListener("click", () => {
    displayToggler();
    document
      .getElementById("quote")
      .scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

editor__info.addEventListener("click", () => {
  const content = `${inputEmail.value} \n ${inputPass.value}`;
  editorDataContent.textContent = content;
  editorDataCard.classList.toggle("active");
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

//ripple effect
function createRipple(event) {
  const button = event.currentTarget;

  const circle = document.createElement("span");
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
  circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
  circle.classList.add("ripple");

  const ripple = button.getElementsByClassName("ripple")[0];

  if (ripple) {
    ripple.remove();
  }

  button.appendChild(circle);

  this.childNodes[1].classList.toggle("expand");
}

const buttons = document.querySelectorAll(".mainNav li");
buttons.forEach((button) => {
  button.addEventListener("click", createRipple);
});

// uploading handling

const editor__upload = document.querySelector(".editor__upload");

editor__upload.addEventListener("click", (e) => {
  e.stopPropagation();
  editorPanel.innerHTML = `
  <form id="resultUpload__form" class="quoteEditorWindow">
          <div class="quoteEditorWindow__head">
            <div>
              <div class="headerTicker__label">একাডেমিক পোর্টাল</div>
              
            </div>
            <button type="button" class="btn">Close</button>
          </div>
          <div>
          <p>ফলাফল উপলব্ধ</p>
          <div class='result__uploaded'>
          ${
            files.length > 0
              ? files
                  .map((file) => {
                    return `<span>${file}</span>`;
                  })
                  .join('')
              : ""
          }
          </div>
          <label class="quoteEditorWindow__field quoteEditorWindow__field--full" for="quote__ref">
           
            <input type="file" accept=".xlsx,.xls" name="result__uploader" id="result__uploader" placeholder="UPLOAD" required />
          </label>
          </div>
          <div class="quoteEditorWindow__actions">
            <button type="reset" class="btn">Reset</button>
            <button type="submit" class="btn">Post</button>
          </div>
        </form>
  `;

  const resultUpload__form = editorPanel.querySelector('#resultUpload__form');
  

  resultUpload__form.addEventListener('submit', async (e) => {
    e.preventDefault();
     const file = e.currentTarget.elements.result__uploader.files[0];
    if (!file) {
    alert("ফাইল নির্বাচন করুন");
    return;
  }

    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const base64Content = reader.result.split(",")[1];
         const response = await fetch("/.netlify/functions/uploadResult", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          content: base64Content,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("ফাইল সফলভাবে আপলোড হয়েছে");
      } else {
        alert(data.error);
      }
      } 
      catch (error) {
      console.error(error);
      alert("আপলোড ব্যর্থ হয়েছে");
    }
    }
      reader.readAsDataURL(file);
    
  })

});




