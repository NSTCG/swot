const swotListEl = document.getElementById("swotList");
const swotEditorEl = document.getElementById("swotEditor");
const swotTitleEl = document.getElementById("swotTitle");
const swotDescriptionEl = document.getElementById("swotDescription");
const swotStrengthsEl = document.getElementById("swotStrengths");
const swotWeaknessesEl = document.getElementById("swotWeaknesses");
const swotOpportunitiesEl = document.getElementById("swotOpportunities");
const swotThreatsEl = document.getElementById("swotThreats");
const swotIdEl = document.getElementById("swotId");
const saveButton = document.getElementById("saveButton");

let currentSwotId = null;

function loadSwots() {
	const swots = JSON.parse(localStorage.getItem("swots") || "[]");
	swotListEl.innerHTML = "";
	swots.forEach((swot) => {
		const swotItem = document.createElement("div");
		swotItem.className = "swot-item";
		swotItem.innerHTML = `
            <h2>${swot.title}</h2>
            <p>Created: ${new Date(swot.created).toLocaleString()}</p>
        `;
		swotItem.onclick = () => editSwot(swot.id);
		swotListEl.appendChild(swotItem);
	});
}

function saveSwot() {
	const swots = JSON.parse(localStorage.getItem("swots") || "[]");
	const swot = {
		id: currentSwotId || Date.now(),
		title: swotTitleEl.value,
		description: swotDescriptionEl.value,
		strengths: swotStrengthsEl.value,
		weaknesses: swotWeaknessesEl.value,
		opportunities: swotOpportunitiesEl.value,
		threats: swotThreatsEl.value,
		created: currentSwotId
			? swots.find((s) => s.id === currentSwotId).created
			: Date.now(),
	};

	if (!currentSwotId) {
		currentSwotId = swot.id; // Assign a new ID if creating a new SWOT
	}

	const swotIndex = swots.findIndex((s) => s.id === swot.id);
	if (swotIndex > -1) {
		swots[swotIndex] = swot;
	} else {
		swots.push(swot);
	}
	localStorage.setItem("swots", JSON.stringify(swots));
	loadSwots();
}

function createNewSwot() {
	currentSwotId = null;
	swotIdEl.textContent = ""; // Clear the SWOT ID display
	swotTitleEl.value = "";
	swotDescriptionEl.value = "";
	swotStrengthsEl.value = "";
	swotWeaknessesEl.value = "";
	swotOpportunitiesEl.value = "";
	swotThreatsEl.value = "";
	openEditor();
}

function editSwot(id) {
	const swots = JSON.parse(localStorage.getItem("swots") || "[]");
	const swot = swots.find((s) => s.id === id);
	currentSwotId = id;
	swotIdEl.textContent = "SWOT ID: " + id; // Display the SWOT ID
	swotTitleEl.value = swot.title;
	swotDescriptionEl.value = swot.description;
	swotStrengthsEl.value = swot.strengths;
	swotWeaknessesEl.value = swot.weaknesses;
	swotOpportunitiesEl.value = swot.opportunities;
	swotThreatsEl.value = swot.threats;
	openEditor();
}

function openEditor() {
	document.querySelector(".swot-grid").style.display = "none";
	swotEditorEl.style.display = "block";
}

function closeEditor() {
	document.querySelector(".swot-grid").style.display = "block";
	swotEditorEl.style.display = "none";
}

// Debounce function to limit the rate at which saveSwot is called
function debounce(func, timeout = 300) {
	let timer;
	return (...args) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			func.apply(this, args);
		}, timeout);
	};
}

const debouncedSaveSwot = debounce(() => saveSwot());

[
	swotTitleEl,
	swotDescriptionEl,
	swotStrengthsEl,
	swotWeaknessesEl,
	swotOpportunitiesEl,
	swotThreatsEl,
].forEach((el) => {
	el.addEventListener("input", debouncedSaveSwot);
});

saveButton.addEventListener("click", saveSwot); // Add event listener to the save button
document.addEventListener("DOMContentLoaded", loadSwots);
