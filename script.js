window.onload = function() {
    const saved = localStorage.getItem("studyPlan");
    if (saved) {
        document.getElementById("plan").innerHTML = saved;
    }

    const progress = localStorage.getItem("progress");
    if (progress) {
        document.getElementById("progress").value = progress;
        document.getElementById("progressText").textContent = progress + "% complete";
    }
}

function generatePlan() {
    const examDate = new Date(document.getElementById("examDate").value);
    const baseHours = parseFloat(document.getElementById("hours").value);

    const today = new Date();
    const planList = document.getElementById("plan");

    planList.innerHTML = "";

    // Get selected subjects
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');

    let subjects = [];
    let totalDifficulty = 0;

    checkboxes.forEach(box => {
        let diff = parseFloat(box.value);
        let name = box.getAttribute("data-name");

        subjects.push({ name: name, difficulty: diff });
        totalDifficulty += diff;
    });

    if (subjects.length === 0) {
        alert("Select at least one subject!");
        return;
    }

    let current = new Date(today);
    let dayCount = 0;

    const totalDays = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));

    let totalWork = totalDays * baseHours * totalDifficulty;

    while (current <= examDate) {
        let li = document.createElement("li");

        // Rest day every 7th day
        if (dayCount % 7 === 6) {
            li.textContent = current.toDateString() + " - Rest Day 😌";
        } else {
            let daysLeft = Math.ceil((examDate - current) / (1000 * 60 * 60 * 24));
            let dailyHours = (totalWork / daysLeft);

            let text = current.toDateString() + ":\n";

            // Split daily time across subjects
            subjects.forEach(sub => {
                let subjectHours = (dailyHours * (sub.difficulty / totalDifficulty)).toFixed(1);
                text += sub.name + ": " + subjectHours + " hrs | ";
            });

            li.textContent = text;

            totalWork -= dailyHours;
        }

        planList.appendChild(li);

        current.setDate(current.getDate() + 1);
        dayCount++;
    }

    localStorage.setItem("studyPlan", planList.innerHTML);
}

function updateProgress() {
    let val = document.getElementById("progress").value;
    document.getElementById("progressText").textContent = val + "% complete";

    localStorage.setItem("progress", val);
}
