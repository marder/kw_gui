const input = document.getElementById("courtInput");
const hiddenCourt = document.getElementById("court");
const suggestions = document.getElementById("suggestions");
const oldKwInput = document.getElementById("old");
const resultDiv = document.getElementById("result");
const historyTableBody = document.getElementById("historyTable");
const generateButton = document.getElementById("generateBtn");

input.addEventListener("input", () => {
    const value = input.value.toLowerCase();
    suggestions.innerHTML = "";

    if (value.length === 0) {
        hiddenCourt.value = "";
        suggestions.style.display = 'none';
        return;
    }

    const filtered = courts.filter(c =>
        c.city.toLowerCase().includes(value) ||
        c.code.toLowerCase().includes(value)
    );

    if (filtered.length > 0) {
        filtered.forEach(court => {
            const li = document.createElement("li");
            li.classList.add("list-group-item");
            li.textContent = `${court.city} (${court.code})`;

            li.addEventListener("click", () => {
                input.value = `${court.city} (${court.code})`;
                hiddenCourt.value = court.code;
                suggestions.innerHTML = "";
                suggestions.style.display = 'none';
                validateInput();
            });

            suggestions.appendChild(li);
        });
        suggestions.style.display = 'block';
    } else {
        suggestions.style.display = 'none';
    }
});

oldKwInput.addEventListener("input", validateInput);
generateButton.addEventListener("click", handleGenerateClick);

function validateInput() {
    const courtCode = hiddenCourt.value.trim();
    const oldKw = oldKwInput.value.trim();

    if (courtCode.length === 4) {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
    } else {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
    }

    if (/^[0-9]+$/.test(oldKw)) {
        oldKwInput.classList.add("is-valid");
        oldKwInput.classList.remove("is-invalid");
    } else {
        oldKwInput.classList.add("is-invalid");
        oldKwInput.classList.remove("is-valid");
    }
}

async function handleGenerateClick() {
    const courtCode = hiddenCourt.value.trim();
    const oldKw = oldKwInput.value.trim();

    if (courtCode.length !== 4 || !/^[0-9]+$/.test(oldKw)) {
        resultDiv.textContent = "Proszę uzupełnić poprawnie oba pola formularza.";
        resultDiv.classList.remove("alert-success");
        resultDiv.classList.add("alert-danger");
        resultDiv.style.display = "block";
        return;
    }

    await generateKW(courtCode, oldKw);
    fetchHistory();
}

async function generateKW(court, old) {
    try {
        const response = await fetch('/kw/convert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ court, old })
        });

        const data = await response.json();

        if (response.ok) {
            resultDiv.textContent = "Nowy numer księgi wieczystej: " + data.newKw;
            resultDiv.classList.remove("alert-danger");
            resultDiv.classList.add("alert-success");
            resultDiv.style.display = "block";
        } else {
            resultDiv.textContent = "Błąd: " + data.message;
            resultDiv.classList.remove("alert-success");
            resultDiv.classList.add("alert-danger");
            resultDiv.style.display = "block";
        }
    } catch (error) {
        resultDiv.textContent = "Wystąpił błąd podczas generowania numeru KW.";
        resultDiv.classList.remove("alert-success");
        resultDiv.classList.add("alert-danger");
        resultDiv.style.display = "block";
    }
}

async function fetchHistory() {
    try {
        const response = await fetch('/kw');
        const records = await response.json();

        historyTableBody.innerHTML = '';

        const latestRecords = records.slice(-10).reverse();

        latestRecords.forEach(record => {
            const row = historyTableBody.insertRow();
            const city = courts.find(c => c.code === record.signature)?.city || 'N/A';

            row.insertCell().textContent = city;
            row.insertCell().textContent = record.oldKw;
            row.insertCell().textContent = record.newKw;
        });
    } catch (error) {
        console.error("Błąd podczas pobierania historii:", error);

    }
}

document.addEventListener("DOMContentLoaded", () => {
    fetchHistory();
    validateInput();
});