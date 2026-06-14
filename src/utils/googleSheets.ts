import { Question, StudentInfo, QuizSubmission } from '../types';

// Hardcoded high-quality interactive questions for Class 8 students on "Internet and its use"
export const DEFAULT_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "What does 'WWW' stand for in a website address?",
    options: ["World Wide Web", "World Wide Warehouse", "Web Wide World", "World Wireless Web"],
    correctOption: "A",
    graphicKeyword: "web",
    helpInstruction: "Think of a global spiderweb made of digital information pages connected together!",
    explanation: "WWW stands for World Wide Web. It is a system of internet servers that support specially formatted HTML documents."
  },
  {
    id: 2,
    text: "Which of these protocols is secure for entering passwords or credentials on a website?",
    options: ["HTTP://", "HTTPS://", "FTP://", "SMTP://"],
    correctOption: "B",
    graphicKeyword: "safety",
    helpInstruction: "Look for the letter 'S' (which stands for Security) and check if a small padlock icon appears next to it!",
    explanation: "HTTPS uses encryption to secure communication over the network. The 'S' stands for secure!"
  },
  {
    id: 3,
    text: "What hardware acts as the 'post master' of the Internet, helping direct data packets from one network to another?",
    options: ["A Web Browser", "A Router", "An Ethernet Cable", "A Monitor"],
    correctOption: "B",
    graphicKeyword: "network",
    helpInstruction: "It routes your web request traffic so it lands safely on the exact computer server you are trying to talk to!",
    explanation: "A router transmits data packets across multiple networks, guiding them efficiently to their destinations."
  },
  {
    id: 4,
    text: "What is the unique numerical label (like 192.168.1.1) assigned to each device connected to the internet?",
    options: ["IP Address (Internet Protocol)", "MAC Address", "Zip Code", "Email ID"],
    correctOption: "A",
    graphicKeyword: "network",
    helpInstruction: "Just like your school has a street address to receive letters, every device has a digital number address to receive messages!",
    explanation: "An IP address (Internet Protocol address) uniquely identifies your computer or device on the internet."
  },
  {
    id: 5,
    text: "When you search for 'space photos' on Google, what kind of program crawls the web indexing page contents?",
    options: ["Antivirus Guard", "Search Engine Crawler or Spider", "Virtual Reality Glass", "Calculator App"],
    correctOption: "B",
    graphicKeyword: "search",
    helpInstruction: "This smart software behaves like a cyber spider, scrolling through pages and cataloging everything it reads!",
    explanation: "Search engines use automated bots called crawlers or spiders to index pages so you can search them instantly."
  },
  {
    id: 6,
    text: "Which of these is considered a safe and responsible digital habit?",
    options: [
      "Sharing passwords with your online gaming buddies", 
      "Clicking on flashing banners that say 'You won a free iPhone!'", 
      "Using strong unique passwords and checking the spelling of website links", 
      "Posting your phone number and home address in public forums"
    ],
    correctOption: "C",
    graphicKeyword: "safety",
    helpInstruction: "Always guard your private key coordinates, and be critical of suspicious popups!",
    explanation: "Using strong passwords and verifying web links helps prevent cyber attacks, keeping your accounts secure."
  },
  {
    id: 7,
    text: "What system acts as the 'contacts list' of the internet, translating links (like google.com) into numerical IP addresses?",
    options: ["Domain Name System (DNS)", "Short Message Service (SMS)", "Central Processing Unit (CPU)", "Random Access Memory (RAM)"],
    correctOption: "A",
    graphicKeyword: "web",
    helpInstruction: "Computers talk in numbers, but humans talk in names. This system sits in between translating google.com into bits!",
    explanation: "DNS (Domain Name System) translates hostnames like google.com into computer-readable IP addresses."
  },
  {
    id: 8,
    text: "What is email spam?",
    options: ["An email from your teacher", "Unsolicited, unwanted bulk emails often containing advertisements or links", "A typing game on the computer", "An email that self-destructs after 5 seconds"],
    correctOption: "B",
    graphicKeyword: "email",
    helpInstruction: "Think of bulk junk mail stuffed into your physical home mailbox that you never requested!",
    explanation: "Email spam, also known as junk email, is unsolicited messages sent in bulk by email, often to sell things or deliver phishing links."
  },
  {
    id: 9,
    text: "What is a browser cookie?",
    options: [
      "A small text file saved on your computer that websites use to remember your settings and active login session",
      "A sweet snack baked by computer program engineers",
      "A software virus that deletes your files",
      "A fast hardware external memory stick connected via USB"
    ],
    correctOption: "A",
    graphicKeyword: "safety",
    helpInstruction: "Think of a digital visitor pass that tells a website you have already checked in!",
    explanation: "Cookies are small files stored on your computer by websites to remember login statuses, language preferences, and personal browser settings."
  },
  {
    id: 10,
    text: "Which of these network security systems acts as a protective barrier to block unauthorized internet traffic?",
    options: ["A local printer scanner", "A network Firewall", "A keyboard keys coordinator", "An optical computer mouse"],
    correctOption: "B",
    graphicKeyword: "safety",
    helpInstruction: "Imagine a security guard standing at a school's gate, checking everyone's entry credentials against safe rules!",
    explanation: "A Firewall monitors and filters incoming and outgoing network traffic based on preset safety rules, securing devices from cyber attacks."
  }
];

// Helper to extract spreadsheet ID from URL
export function extractSpreadsheetId(url: string): string | null {
  if (!url) return null;
  // standard pattern /d/{ID}/
  const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (match) return match[1];
  
  // fallback if they paste just the ID
  if (/^[a-zA-Z0-9-_]{15,}$/.test(url.trim())) {
    return url.trim();
  }
  return null;
}

// Robust RFC-compliant CSV Parser to handle Excel and Google Sheet exports
export function parseCSV(text: string): string[][] {
  const result: string[][] = [];
  let row: string[] = [];
  let inQuotes = false;
  let entry = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        entry += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(entry.trim());
      entry = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      row.push(entry.trim());
      if (row.length > 0 && row.some(cell => cell !== '')) {
        result.push(row);
      }
      row = [];
      entry = '';
    } else {
      entry += char;
    }
  }

  if (entry || row.length > 0) {
    row.push(entry.trim());
    if (row.some(cell => cell !== '')) {
      result.push(row);
    }
  }

  return result;
}

// Fetch questions from Google Sheet via CSV Export (Public fallback/super robust)
export async function fetchQuestionsFromPublicSheet(spreadsheetId: string, sheetName = 'Questions'): Promise<Question[]> {
  const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&sheet=${encodeURIComponent(sheetName)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download spreadsheet sheet '${sheetName}'. Ensure the sheet is shared as 'Anyone with link can view'`);
  }
  const text = await response.text();
  const rows = parseCSV(text);
  
  if (rows.length <= 1) {
    throw new Error(`The sheet '${sheetName}' is empty or contains only headers.`);
  }

  // Expect columns: ID, Question, Option A, Option B, Option C, Option D, Correct Option, Graphic Keyword, Help Instruction, Explanation
  const headers = rows[0].map(h => h.toLowerCase().trim());
  const idxId = headers.indexOf('id');
  const idxQuestion = headers.findIndex(h => h.includes('question') || h.includes('text'));
  const idxOptA = headers.findIndex(h => h.includes('option a') || h.includes('opt a') || h === 'a');
  const idxOptB = headers.findIndex(h => h.includes('option b') || h.includes('opt b') || h === 'b');
  const idxOptC = headers.findIndex(h => h.includes('option c') || h.includes('opt c') || h === 'c');
  const idxOptD = headers.findIndex(h => h.includes('option d') || h.includes('opt d') || h === 'd');
  const idxCorrect = headers.findIndex(h => h.includes('correct') || h.includes('answer') || h.includes('key'));
  const idxGraphic = headers.findIndex(h => h.includes('graphic') || h.includes('keyword') || h.includes('image'));
  const idxHelp = headers.findIndex(h => h.includes('help') || h.includes('instruction') || h.includes('hint'));
  const idxExpl = headers.findIndex(h => h.includes('explanation') || h.includes('reason'));

  const questions: Question[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length === 0 || !row[idxQuestion]) continue;

    const optA = idxOptA >= 0 && row[idxOptA] ? row[idxOptA] : 'Option A';
    const optB = idxOptB >= 0 && row[idxOptB] ? row[idxOptB] : 'Option B';
    const optC = idxOptC >= 0 && row[idxOptC] ? row[idxOptC] : 'Option C';
    const optD = idxOptD >= 0 && row[idxOptD] ? row[idxOptD] : 'Option D';

    // Parse correct option
    let rawCorrect = idxCorrect >= 0 && row[idxCorrect] ? row[idxCorrect].toUpperCase().trim() : 'A';
    if (!['A', 'B', 'C', 'D'].includes(rawCorrect)) {
      if (rawCorrect === '1' || rawCorrect.includes(optA.toUpperCase())) rawCorrect = 'A';
      else if (rawCorrect === '2' || rawCorrect.includes(optB.toUpperCase())) rawCorrect = 'B';
      else if (rawCorrect === '3' || rawCorrect.includes(optC.toUpperCase())) rawCorrect = 'C';
      else if (rawCorrect === '4' || rawCorrect.includes(optD.toUpperCase())) rawCorrect = 'D';
      else rawCorrect = 'A';
    }

    questions.push({
      id: idxId >= 0 && row[idxId] ? row[idxId] : i,
      text: row[idxQuestion],
      options: [optA, optB, optC, optD],
      correctOption: rawCorrect as 'A' | 'B' | 'C' | 'D',
      graphicKeyword: idxGraphic >= 0 && row[idxGraphic] ? row[idxGraphic].toLowerCase().trim() : 'web',
      helpInstruction: idxHelp >= 0 && row[idxHelp] ? row[idxHelp] : 'Use your general internet safety rules to answer!',
      explanation: idxExpl >= 0 && row[idxExpl] ? row[idxExpl] : 'That is the correct answer!'
    });
  }

  return questions;
}

// Fetch questions using Google Sheets REST API (if authenticated with Access Token)
export async function fetchQuestionsViaApi(spreadsheetId: string, accessToken: string): Promise<Question[]> {
  const range = 'Questions!A1:J100';
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`;
  
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Failed to fetch questions via Google Sheets API');
  }

  const data = await response.json();
  const rows = data.values as string[][] | undefined;
  
  if (!rows || rows.length <= 1) {
    throw new Error("No data found, or spreadsheet Questions tab is empty!");
  }

  // map rows to questions same as CSV (rows is array of cells arrays)
  const headers = rows[0].map(h => h.toLowerCase().trim());
  const idxId = headers.indexOf('id');
  const idxQuestion = headers.findIndex(h => h.includes('question') || h.includes('text'));
  const idxOptA = headers.indexOf('option a') !== -1 ? headers.indexOf('option a') : headers.findIndex(h => h === 'option a' || h === 'a');
  const idxOptB = headers.indexOf('option b') !== -1 ? headers.indexOf('option b') : headers.findIndex(h => h === 'option b' || h === 'b');
  const idxOptC = headers.indexOf('option c') !== -1 ? headers.indexOf('option c') : headers.findIndex(h => h === 'option c' || h === 'c');
  const idxOptD = headers.indexOf('option d') !== -1 ? headers.indexOf('option d') : headers.findIndex(h => h === 'option d' || h === 'd');
  const idxCorrect = headers.findIndex(h => h.includes('correct'));
  const idxGraphic = headers.findIndex(h => h.includes('graphic') || h.includes('keyword'));
  const idxHelp = headers.findIndex(h => h.includes('help') || h.includes('instruction') || h.includes('hint'));
  const idxExpl = headers.findIndex(h => h.includes('explanation'));

  const questions: Question[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0 || !row[idxQuestion]) continue;

    const optA = idxOptA >= 0 && row[idxOptA] ? row[idxOptA] : 'Option A';
    const optB = idxOptB >= 0 && row[idxOptB] ? row[idxOptB] : 'Option B';
    const optC = idxOptC >= 0 && row[idxOptC] ? row[idxOptC] : 'Option C';
    const optD = idxOptD >= 0 && row[idxOptD] ? row[idxOptD] : 'Option D';

    let rawCorrect = idxCorrect >= 0 && row[idxCorrect] ? row[idxCorrect].toUpperCase().trim() : 'A';
    if (!['A', 'B', 'C', 'D'].includes(rawCorrect)) {
      rawCorrect = 'A';
    }

    questions.push({
      id: idxId >= 0 && row[idxId] ? row[idxId] : i,
      text: row[idxQuestion],
      options: [optA, optB, optC, optD],
      correctOption: rawCorrect as 'A' | 'B' | 'C' | 'D',
      graphicKeyword: idxGraphic >= 0 && row[idxGraphic] ? row[idxGraphic].toLowerCase().trim() : 'web',
      helpInstruction: idxHelp >= 0 && row[idxHelp] ? row[idxHelp] : 'Read the choices carefully!',
      explanation: idxExpl >= 0 && row[idxExpl] ? row[idxExpl] : 'Perfect!'
    });
  }

  return questions;
}

// Append results to Google Sheets (authenticated or public/local)
export async function saveSubmissionToSheet(spreadsheetId: string, submission: QuizSubmission, accessToken?: string | null): Promise<boolean> {
  const timestamp = submission.timestamp;
  const s = submission.student;
  const scoreString = `${submission.score} / ${submission.totalQuestions}`;
  const answersJson = JSON.stringify(submission.answers);

  const rowValues = [timestamp, s.name, s.className, s.section, s.rollNumber, scoreString, answersJson];

  if (accessToken) {
    // Write via sheets REST API
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Results!A:G:append?valueInputOption=USER_ENTERED`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          values: [rowValues]
        })
      });
      if (res.ok) {
        return true;
      }
    } catch (e) {
      console.error('Error writing to Google Sheet API:', e);
    }
  }

  // fallback/mock write (logs results in local storage for transparency)
  const localSubmissions = JSON.parse(localStorage.getItem(`quiz_submissions_${spreadsheetId}`) || '[]');
  localSubmissions.push(submission);
  localStorage.setItem(`quiz_submissions_${spreadsheetId}`, JSON.stringify(localSubmissions));
  return false;
}

// Initialize sheets inside clean/empty Google spreadsheet
export async function initializeQuestionsAndResultsSheets(spreadsheetId: string, accessToken: string): Promise<boolean> {
  // 1. Create Question sheet and Results sheet
  // (We use batchUpdate to rename or add sheets)
  const metaUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`;
  const metaRes = await fetch(metaUrl, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!metaRes.ok) {
    throw new Error('Could not read Spreadsheet metadata to check sheets.');
  }
  const metaObj = await metaRes.json();
  const sheets = metaObj.sheets as any[] || [];
  const sheetTitles = sheets.map(s => s.properties.title);

  const requests: any[] = [];
  
  if (!sheetTitles.includes('Questions')) {
    requests.push({ addSheet: { properties: { title: 'Questions' } } });
  }
  if (!sheetTitles.includes('Results')) {
    requests.push({ addSheet: { properties: { title: 'Results' } } });
  }

  if (requests.length > 0) {
    const updateRes = await fetch(`${metaUrl}:batchUpdate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ requests })
    });
    if (!updateRes.ok) {
      throw new Error('Failed to create Questions or Results sheet tabs.');
    }
  }

  // 2. Put headers in Questions
  const headersQuestions = [
    'ID', 'Question', 'Option A', 'Option B', 'Option C', 'Option D', 'Correct Option', 'Graphic Keyword', 'Help Instruction', 'Explanation'
  ];
  const qValues = [
    headersQuestions,
    ...DEFAULT_QUESTIONS.map(q => [
      q.id,
      q.text,
      q["options"][0],
      q["options"][1],
      q["options"][2],
      q["options"][3],
      q.correctOption,
      q.graphicKeyword,
      q.helpInstruction,
      q.explanation
    ])
  ];

  await fetch(`${metaUrl}/values/Questions!A1:J20?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({ values: qValues })
  });

  // 3. Put headers in Results
  const headersResults = [
    'Timestamp', 'Student Name', 'Class', 'Section', 'Roll Number', 'Score', 'Answers Given (JSON)'
  ];

  await fetch(`${metaUrl}/values/Results!A1:G1?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({ values: [headersResults] })
  });

  return true;
}
