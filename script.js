const companyListElement = document.getElementById('company-list');
const questionListElement = document.getElementById('question-list');
const companyNameElement = document.getElementById('company-name');
const questionsElement = document.getElementById('questions');
const backButton = document.getElementById('back-button');
const baseUrl = 'https://raw.githubusercontent.com/krishnadey30/LeetCode-Questions-CompanyWise/master/';

backButton.addEventListener('click', () => {
    companyListElement.style.display = 'block';
    questionListElement.style.display = 'none';
});

function properName(str) {
    return (str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()).replace('_alltime.csv', '');
}


async function fetchAndDisplayCompanies() {
    const response = await fetch('https://api.github.com/repos/krishnadey30/LeetCode-Questions-CompanyWise/contents/');
    // console.log(typeof(response));
    const files = await response.json();
    // console.log(typeof(files));
    const csvFiles = files.filter(file => file.name.endsWith('_alltime.csv'));

    csvFiles.forEach(file => {
        const companyElement = document.createElement('div');
        companyElement.className = 'company';
        companyElement.innerText = properName(file.name);
        companyElement.onclick = () => fetchAndDisplayQuestions(file.name);
        companyListElement.appendChild(companyElement);
    });
}

async function fetchAndDisplayQuestions(fileName){
    const csvData = await fetchCSV(fileName);
    const questions = parseCSV(csvData);
    displayQuestions(fileName, questions);
}


async function fetchCSV(fileName) {
    const response = await fetch(`${baseUrl}${fileName}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${fileName}`);
    }
    return response.text();
}


function parseCSV(csvData) {
    const lines = csvData.split('\n');
    const headers = lines[0].split(',');
    const questions = [];

    for (let i = 1; i < lines.length; i++) {
        const data = lines[i].split(',');
        if (data.length === headers.length) {
            const question = {};
            for (let j = 0; j < headers.length; j++) {
                question[headers[j].trim()] = data[j].trim();
            }
            questions.push(question);
        }
    }

    return questions;
}

function displayQuestions(companyName, questions) {
    companyNameElement.innerText = properName(companyName);
    questionsElement.innerHTML = ''; // Clear previous questions

    // Create table
    const table = document.createElement('table');
    table.className = 'question-table';

    // Create table header
    const header = table.createTHead();
    const headerRow = header.insertRow();
    const columns = Object.keys(questions[0]); // Assumes all questions have the same columns
    columns.forEach(col => {
        const th = document.createElement('th');
        th.innerText = col;
        headerRow.appendChild(th);
    });

    // Create table body
    const tbody = document.createElement('tbody');
    questions.forEach(question => {
        const row = tbody.insertRow();

        columns.forEach(col => {
            const cell = row.insertCell();
            cell.innerText = question[col];
        });

        const linkCell = row.insertCell();
        const link = document.createElement('a');
        link.href = question["Leetcode Question Link"];
        link.target = '_blank';
        link.innerText = 'Solve';
        linkCell.appendChild(link);
    });

    table.appendChild(tbody);
    questionsElement.appendChild(table);

    companyListElement.style.display = 'none';
    questionListElement.style.display = 'block';
}

// Fetch and display the list of companies when the page loads
fetchAndDisplayCompanies();
