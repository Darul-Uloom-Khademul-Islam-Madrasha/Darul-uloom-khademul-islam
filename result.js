let sheetUrl = [];
const optClass = document.querySelector("#class");
const optYear = document.querySelector("#year");
const optStds = document.querySelector("#stds");
const resultContainer = document.querySelector(".result-container");
const resultStatus = document.querySelector("#resultStatus");




let fullResultByYear = [];
let resultPerStd = [];

document.addEventListener("DOMContentLoaded", async () => {
  await loadResultsFiles();
   
  generateYearsFromSheets();
  resetClassSelect();
  resetStudentSelect();
  showStatus(
    "ফলাফল দেখার জন্য নির্বাচন সম্পূর্ণ করুন",
    "সাল, শ্রেণী এবং শিক্ষার্থীর নাম নির্বাচন করলে নিচে ফলাফল দেখা যাবে।"
  );

  
});

function setOptions(select, placeholder, items, valueKey, labelKey) {
  const options = [`<option value="">${placeholder}</option>`]
    .concat(
      items.map((item) => {
        const value = valueKey ? item[valueKey] : item;
        const label = labelKey ? item[labelKey] : item;
        return `<option value="${escapeHtml(String(value))}">${escapeHtml(
          String(label)
        )}</option>`;
      })
    )
    .join("");

  select.innerHTML = options;
}

function generateYearsFromSheets() {
  const years = sheetUrl
    .map((sheet) => (sheet.match(/\d+/) || [""])[0])
    .filter(Boolean);

  setOptions(optYear, "সাল নির্বাচন করুন", years);
}

function resetClassSelect() {
  setOptions(optClass, "শ্রেণী / মারহালা নির্বাচন করুন", []);
}

function resetStudentSelect() {
  setOptions(optStds, "ছাত্র / ছাত্রী নির্বাচন করুন", []);
}

optYear.addEventListener("change", async (e) => {
  const selectedYear = e.target.value;
  resetClassSelect();
  resetStudentSelect();
  resultContainer.innerHTML = "";
  resultPerStd = [];

  if (!selectedYear) {
    showStatus(
      "ফলাফল দেখার জন্য নির্বাচন সম্পূর্ণ করুন",
      "প্রথমে পরীক্ষার সাল নির্বাচন করুন।"
    );
    return;
  }

  showStatus(
    "তথ্য প্রস্তুত করা হচ্ছে",
    "নির্বাচিত সালের ফলাফল তালিকা লোড করা হচ্ছে।"
  );

  const url = sheetUrl.find((sheet) => sheet.includes(selectedYear));
  
 const fileUrl = `https://raw.githubusercontent.com/Darul-Uloom-Khademul-Islam-Madrasha/Darul-uloom-khademul-islam/main/public/results/${url}`;

 await fetchAndParseMadrashaExcel(fileUrl);

  if (fullResultByYear.length) {
    setOptions(optClass, "শ্রেণী / মারহালা নির্বাচন করুন", fullResultByYear, "className", "className");
    showStatus(
      "শ্রেণী নির্বাচন করুন",
      "এখন আপনার প্রয়োজনীয় শ্রেণী বা মারহালা নির্বাচন করুন।"
    );
  }
});

optClass.addEventListener("change", (e) => {
  const selectedClass = fullResultByYear.find(
    (item) => item.className === e.target.value
  );

  resetStudentSelect();
  resultContainer.innerHTML = "";

  if (!selectedClass) {
    resultPerStd = [];
    showStatus(
      "শিক্ষার্থীর নাম নির্বাচন বাকি আছে",
      "উপযুক্ত ফলাফল দেখতে আগে একটি শ্রেণী নির্বাচন করুন।"
    );
    return;
  }

  resultPerStd = selectedClass.students;
  setOptions(optStds, "ছাত্র / ছাত্রী নির্বাচন করুন", selectedClass.students, "name", "name");
  showStatus(
    "শিক্ষার্থীর নাম নির্বাচন করুন",
    "এখন এই শ্রেণীর ছাত্র বা ছাত্রীর নাম নির্বাচন করুন।"
  );
});

optStds.addEventListener("change", (e) => {
  const std = resultPerStd.find((item) => item.name === e.target.value);

  if (!std) {
    resultContainer.innerHTML = "";
    showStatus(
      "ফলাফল দেখার জন্য নির্বাচন সম্পূর্ণ করুন",
      "শিক্ষার্থীর নাম নির্বাচন করলে ফলাফল কার্ড নিচে দেখা যাবে।"
    );
    return;
  }

  generateResultCard(std);
  showStatus(
    "ফলাফল প্রস্তুত",
    "নির্বাচিত শিক্ষার্থীর ফলাফল কার্ড নিচে দেখানো হয়েছে।"
  );
});

async function fetchAndParseMadrashaExcel(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("ফাইল ডাউনলোড করতে সমস্যা হয়েছে");

    const buffer = await response.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });

    const madrashaResults = {
      madrashaName: "",
      location: "",
      year: "",
      exams: [],
    };

    workbook.SheetNames.forEach((sheetName, sIdx) => {
      const worksheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });

      if (!rows.length) return;

      if (sIdx === 0 && rows[0]) {
        const headerStr = rows[0].join(",");
        const headerParts = headerStr.split(",");
        madrashaResults.madrashaName = headerParts[0].trim();
        madrashaResults.location = "চুয়াডাঙ্গা";
        madrashaResults.year = rows[1] ? rows[1].join(" ").trim() : "";
      }

      let currentExam = null;
      let subjectsList = [];
      let colMap = {};

      rows.forEach((row) => {
        const rowStr = row.join(" ");

        if (rowStr.includes("শ্রেণীঃ")) {
          currentExam = {
            className: rowStr.match(/শ্রেণীঃ\s*([^\s]+)/)?.[1] || "অজানা",
            totalSubjects: 0,
            totalMarks: 0,
            subjects: [],
            students: [],
          };

          const metaMatch = rowStr.match(/মোট বিষয় (\d+)টি.*পূর্ণমান\s+(\d+)/);
          if (metaMatch) {
            currentExam.totalSubjects = parseInt(metaMatch[1], 10);
            currentExam.totalMarks = parseInt(metaMatch[2], 10);
          }
          madrashaResults.exams.push(currentExam);
        }

        if (row.includes("ক্র. নং.") || row.includes("পরীক্ষার্থীর নাম")) {
          colMap = {};
          subjectsList = [];
          row.forEach((cell, idx) => {
            const val = String(cell).trim();
            if (!val) return;
            colMap[val] = idx;

            const nonSubjects = ["ক্র. নং.", "পরীক্ষার্থীর নাম", "মোট", "গড়", "বিভাগ", "স্থান"];
            if (!nonSubjects.includes(val)) subjectsList.push(val);
          });
          if (currentExam) currentExam.subjects = subjectsList;
        }

        const roll = parseInt(row[colMap["ক্র. নং."]], 10);
        if (!Number.isNaN(roll) && currentExam) {
          const student = {
            roll,
            name: String(row[colMap["পরীক্ষার্থীর নাম"]] || "").trim(),
            marks: {},
            total: row[colMap["মোট"]] || 0,
            average: row[colMap["গড়"]] || 0,
            grade: row[colMap["বিভাগ"]] || "",
            rank: row[colMap["স্থান"]] || 0,
          };

          subjectsList.forEach((sub) => {
            student.marks[sub] = row[colMap[sub]] || 0;
          });

          currentExam.students.push(student);
        }
      });
    });

    fullResultByYear = madrashaResults.exams;
    return madrashaResults;
  } catch (error) {
    console.error("Error:", error);
    showStatus(
      "ফলাফল লোড করা যায়নি",
      "দয়া করে আবার চেষ্টা করুন অথবা ফাইল সংযোগ পরীক্ষা করুন।"
    );
  }
}

function toBengaliNumeral(num) {
  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num
    .toString()
    .split("")
    .map((digit) => (Number.isNaN(Number(digit)) ? digit : bengaliDigits[parseInt(digit, 10)]))
    .join("");
}

function getBengaliRank(rank) {
  if (rank === 1) return "প্রথম";
  if (rank === 2) return "দ্বিতীয়";
  if (rank === 3) return "তৃতীয়";
  if (rank === 4) return "চতুর্থ";
  if (rank === 5) return "পঞ্চম";
  return `${toBengaliNumeral(rank)}ম`;
}

function generateResultCard(data) {
  const cardHTML = `
    <div class="result-card">
      <div class="card-header">
        <div onclick='printContainer()' class="print-area">
         <img src="./img/print.svg" alt="" srcset="" />
        </div>
        <h1>পরীক্ষার ফলাফল</h1>
        <div class="w-ornament">✦ ✦ ✦</div>
      </div>

      <div class="student-info">
        <h2 class="student-name">${escapeHtml(data.name)}</h2>
        <div class="student-roll">রোল নং: ${toBengaliNumeral(data.roll)}</div>
      </div>

      <div class="result-summary">
        <div class="summary-box">
          <div class="summary-label">মোট নম্বর</div>
          <div class="summary-value">${toBengaliNumeral(data.total)}</div>
        </div>
        <div class="summary-box">
          <div class="summary-label">গড়</div>
          <div class="summary-value">${toBengaliNumeral(Number(data.average).toFixed(2))}</div>
        </div>
        <div class="summary-box grade-box">
          <div class="summary-label">গ্রেড</div>
          <div class="summary-value grade-arabic">${escapeHtml(data.grade)}</div>
        </div>
        <div class="summary-box rank-box">
          <div class="summary-label">মেধাক্রম</div>
          <div class="summary-value">${getBengaliRank(data.rank)}</div>
        </div>
      </div>

      <div class="marks-table-wrap">
        <h3>বিষয়ভিত্তিক নম্বর</h3>
      </div>
      <table class="marks-table">
        <thead>
          <tr>
            <th>বিষয়</th>
            <th>প্রাপ্ত নম্বর</th>
          </tr>
        </thead>
        <tbody>
          ${generateSubjectRows(data.marks)}
          <tr class="total-row">
            <td>মোট</td>
            <td>${toBengaliNumeral(data.total)}</td>
          </tr>
          <tr class="avg-row">
            <td>গড়</td>
            <td>${toBengaliNumeral(Number(data.average).toFixed(2))}</td>
          </tr>
        </tbody>
      </table>
    </div>`;

  resultContainer.innerHTML = cardHTML;
}

function generateSubjectRows(marks) {
  let rowsHTML = "";
  for (const [subject, mark] of Object.entries(marks)) {
    rowsHTML += `
      <tr>
        <td>${escapeHtml(subject)}</td>
        <td>${toBengaliNumeral(mark)}</td>
      </tr>`;
  }
  return rowsHTML;
}

function showStatus(title, message) {
  if (!resultStatus) return;
  resultStatus.innerHTML = `
    <div class="resultStatus__card">
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(message)}</p>
    </div>`;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}


function printContainer() {
  if (!resultContainer || !resultContainer.querySelector(".result-card")) {
    showStatus(
      "প্রিন্ট করার মতো ফলাফল নেই",
      "প্রথমে একজন শিক্ষার্থীর ফলাফল নির্বাচন করুন, তারপর প্রিন্ট করুন।"
    );
    return;
  }

  window.print();
}



async function loadResultsFiles() {
  try {
    const response = await fetch('/.netlify/functions/resultsList');
    const data = await response.json();
    
    const files = data.files;
    sheetUrl = files;
    
    
  } catch (error) {
    console.error('Error loading files:', error);
  }
}

