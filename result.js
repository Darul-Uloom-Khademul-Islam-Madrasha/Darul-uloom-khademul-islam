const sheetUrl = ["res-2023.xlsx", "res-2024.xlsx", "res-2025.xlsx"];
const optClass = document.querySelector("#class");
const optYear = document.querySelector('#year');
const optStds = document.querySelector('#stds');


let fullResultByYear = {};
let resultPerStd = [];


document.addEventListener('DOMContentLoaded', function() {
    
    //default setup on startup
    
    generateYearsFromSheets();
    
});



function generateYearsFromSheets() {
    
    const html = sheetUrl.map((sheet, idx) => {
        const year = sheet.match(/\d+/);
        return `<option value=${year}>${year}</option>`
    }).join("");
    
    optYear.innerHTML = '<option value="">সাল নির্বাচনঃ</option>' + html;
    
    
}


function generateClassFromSheets(classes) {
    
    const html = classes.map((cls, idx) => {
        return `<option value=${cls.className}>${cls.className}</option>`
    });
    optClass.innerHTML = '<option value="">শ্রেণী নির্বাচনঃ</option>' + html;
}




optClass.addEventListener("change", (e) => {
    
    const selectedClass = fullResultByYear.find(className => className.className === e.target.value);
    
    generateStudentName(selectedClass.students);
    resultPerStd = selectedClass.students;
})




optYear.addEventListener("change", (e) => {
    
    const url = sheetUrl.find(sheet => sheet.includes(e.target.value));
    
    fetchAndParseMadrashaExcel(url);
    
});




function generateStudentName(stds) {
    
    const html = stds.map((std, idx) => {
        return `<option value="${std.name}">${std.name}</option>`
    });
    optStds.innerHTML = '<option value="">ছাত্র/ছাত্রী নির্বাচনঃ</option>' + html;
}


optStds.addEventListener("change", (e) => {
    
    const std = resultPerStd.find(std => {
        return std.name === e.target.value
        
    })
    
    generateResultCard(std);
    
    
});


async function fetchAndParseMadrashaExcel(url) {
    try {
        // ১. ফাইলটি ফেচ করা
        const response = await fetch(url);
        if (!response.ok) throw new Error("ফাইল ডাউনলোড করতে সমস্যা হয়েছে");
        
        const buffer = await response.arrayBuffer();
        
        // ২. SheetJS দিয়ে ফাইলটি পড়া
        const workbook = XLSX.read(buffer, { type: 'array' });
        
        const madrashaResults = {
            madrashaName: "",
            location: "",
            year: "",
            exams: []
        };
        
        workbook.SheetNames.forEach((sheetName, sIdx) => {
            const worksheet = workbook.Sheets[sheetName];
            const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });
            
            if (rows.length === 0) return;
            
            // বেসিক ইনফো সেট করা (প্রথম শিট থেকে)
            if (sIdx === 0 && rows[0]) {
                const headerStr = rows[0].join(",");
                const headerParts = headerStr.split(",");
                madrashaResults.madrashaName = headerParts[0].trim();
                madrashaResults.location = "চুয়াডাঙ্গা"; // আপনার ফাইল অনুযায়ী ফিক্সড বা সার্চ করে নেওয়া যায়
                madrashaResults.year = rows[1] ? rows[1].join(" ").trim() : "";
            }
            
            let currentExam = null;
            let subjectsList = [];
            let colMap = {};
            
            rows.forEach((row) => {
                const rowStr = row.join(" ");
                
                // ক্লাস শনাক্তকরণ
                if (rowStr.includes("শ্রেণীঃ")) {
                    currentExam = {
                        className: rowStr.match(/শ্রেণীঃ\s*([^\s]+)/)?.[1] || "অজানা",
                        totalSubjects: 0,
                        totalMarks: 0,
                        subjects: [],
                        students: []
                    };
                    
                    const metaMatch = rowStr.match(/মোট বিষয় (\d+)টি.*পূর্ণমান\s+(\d+)/);
                    if (metaMatch) {
                        currentExam.totalSubjects = parseInt(metaMatch[1]);
                        currentExam.totalMarks = parseInt(metaMatch[2]);
                    }
                    madrashaResults.exams.push(currentExam);
                }
                
                // হেডার এবং কলাম ম্যাপিং
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
                
                // স্টুডেন্ট ডেটা পুশ করা
                const roll = parseInt(row[colMap["ক্র. নং."]]);
                if (!isNaN(roll) && currentExam) {
                    const student = {
                        roll: roll,
                        name: String(row[colMap["পরীক্ষার্থীর নাম"]] || "").trim(),
                        marks: {},
                        total: row[colMap["মোট"]] || 0,
                        average: row[colMap["গড়"]] || 0,
                        grade: row[colMap["বিভাগ"]] || "",
                        rank: row[colMap["স্থান"]] || 0
                    };
                    
                    subjectsList.forEach(sub => {
                        student.marks[sub] = row[colMap[sub]] || 0;
                    });
                    
                    currentExam.students.push(student);
                }
            });
        });
        
        generateClassFromSheets(madrashaResults.exams);
        
        fullResultByYear = madrashaResults.exams;
        return madrashaResults;
        
    } catch (error) {
        console.error("Error:", error);
    }
}






// to show result


// Function to convert English numerals to Bengali
function toBengaliNumeral(num) {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().split('').map(digit => {
        return isNaN(digit) ? digit : bengaliDigits[parseInt(digit)];
    }).join('');
}

// Function to convert rank number to Bengali ordinal
function getBengaliRank(rank) {
    if (rank === 1) return 'প্রথম';
    if (rank === 2) return 'দ্বিতীয়';
    if (rank === 3) return 'তৃতীয়';
    if (rank === 4) return 'চতুর্থ';
    if (rank === 5) return 'পঞ্চম';
    // For other numbers, you can add more cases or use a generic format
    return toBengaliNumeral(rank) + 'ম';
}

// Function to generate the result card
function generateResultCard(data) {
    const cardHTML = `
        <div class="result-card">
            
            <!-- Header -->
            <div class="card-header">
                <div class="logo-area">
                </div>
                <h1>পরীক্ষার ফলাফল</h1>
                <div class="w-ornament">✦ ✦ ✦</div>
            </div>
            
            <!-- Student Info -->
            <div class="student-info">
                <h2 class="student-name">${data.name}</h2>
                <div class="student-roll">রোল নং: ${toBengaliNumeral(data.roll)}</div>
            </div>
            
            <!-- Summary Boxes -->
            <div class="result-summary">
                <div class="summary-box">
                    <div class="summary-label">মোট নম্বর</div>
                    <div class="summary-value">${toBengaliNumeral(data.total)}</div>
                </div>
                <div class="summary-box">
                    <div class="summary-label">গড়</div>
                    <div class="summary-value">${toBengaliNumeral(data.average.toFixed(2))}</div>
                </div>
                <div class="summary-box grade-box">
                    <div class="summary-label">গ্রেড</div>
                    <div class="summary-value grade-arabic">${data.grade}</div>
                </div>
                <div class="summary-box rank-box">
                    <div class="summary-label">মেধাক্রম</div>
                    <div class="summary-value">${getBengaliRank(data.rank)}</div>
                </div>
            </div>
            
            <!-- Marks Table -->
            <div class="marks-table-wrap">
                <h3>বিষয়ভিত্তিক নম্বর</h3>
            </div>
            <table class="marks-table">
                <thead>
                    <tr>
                        <th>বিষয়</th>
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
                        <td>গড়</td>
                        <td>${toBengaliNumeral(data.average.toFixed(2))}</td>
                    </tr>
                </tbody>
            </table>
            </div>`
    
    document.querySelector(".result-container").innerHTML = cardHTML;
};





// Function to generate subject rows
function generateSubjectRows(marks) {
    let rowsHTML = '';
    for (const [subject, mark] of Object.entries(marks)) {
        rowsHTML += `
            <tr>
                <td>${subject}</td>
                <td>${toBengaliNumeral(mark)}</td>
            </tr>
        `;
    }
    return rowsHTML;
}

// Function to render the card
function renderResultCard(data) {
    const container = document.getElementById('result-container');
    if (container) {
        container.innerHTML = generateResultCard(data);
    } else {
        console.error('Result container not found! Make sure you have a div with id="result-container"');
    }
}

/*
// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    renderResultCard(studentData);
});

// Export for external use
window.generateResultCard = generateResultCard;
window.renderResultCard = renderResultCard;
window.studentData = studentData;

*/