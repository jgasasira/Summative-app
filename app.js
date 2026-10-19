(function () {
    "use strict";

    const STORAGE_KEY = "alu_vault_database_records";
    let vaultItems = [];

    const seedData = [
        {
            id: "rec_0001",
            title: "ALU Leadership Core Values Note",
            pages: 12,
            date: new Date().toISOString().split('T')[0],
            tags: "education/leadership",
            advanced: "The primary pattern requires double double words.",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: "rec_0002",
            title: "Responsive Flexbox Cheatsheet Booklet",
            pages: 4,
            date: new Date().toISOString().split('T')[0],
            tags: "tech/css",
            advanced: "Ensure you check check background colors systematically.",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ];

    const REGEX_RULES = {
        title: /^[^\s](?!.*?\s{2,}).*[^\s]$/,
        pages: /^[1-9]\d{0,3}$/,
        date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
        tags: /^[a-z]+(?:\/[a-z]+)*$/,
        advanced: /\b([A-Za-z]+)\s+\1\b/
    };

    const DOM = {
        form: document.getElementById("resource-form"),
        editRecordId: document.getElementById("edit-record-id"),
        cancelEditBtn: document.getElementById("cancel-edit-btn"),
        submitFormBtn: document.getElementById("submit-form-btn"),
        inputTitle: document.getElementById("input-title"),
        inputPages: document.getElementById("input-pages"),
        inputDate: document.getElementById("input-date"),
        inputTags: document.getElementById("input-tags"),
        inputAdvanced: document.getElementById("input-advanced"),
        inputLimit: document.getElementById("input-limit"),
        errTitle: document.getElementById("err-title"),
        errPages: document.getElementById("err-pages"),
        errDate: document.getElementById("err-date"),
        errTags: document.getElementById("err-tags"),
        errAdvanced: document.getElementById("err-advanced"),
        itemsContainer: document.getElementById("vault-items-container"),
        statTotal: document.getElementById("stat-total"),
        statSumPages: document.getElementById("stat-sum-pages"),
        statTopTag: document.getElementById("stat-top-tag"),
        capMessage: document.getElementById("cap-live-message"),
        trendChartBars: document.getElementById("trend-chart-bars"),
        convertInput: document.getElementById("convert-input"),
        convertMode: document.getElementById("convert-mode"),
        conversionResult: document.getElementById("conversion-result-display"),
        searchField: document.getElementById("vault-search"),
        searchError: document.getElementById("search-error"),
        sortTitleBtn: document.getElementById("sort-title-btn"),
        sortPagesBtn: document.getElementById("sort-pages-btn"),
        sortDateBtn: document.getElementById("sort-date-btn"),
        exportBtn: document.getElementById("export-json-btn"),
        importArea: document.getElementById("import-json-area"),
        importBtn: document.getElementById("import-json-btn"),
        importError: document.getElementById("import-error"),
        scrapeInput: document.getElementById("scrape-html-input"),
        scrapeExecute: document.getElementById("scrape-execute-btn"),
        scrapeOutput: document.getElementById("scrape-output-display")
    };

    function loadDatabase() {
        try {
            const dataString = localStorage.getItem(STORAGE_KEY);
            if (dataString) {
                vaultItems = JSON.parse(dataString);
            } else {
                vaultItems = [...seedData];
                saveDatabase();
            }
        } catch (e) {
            vaultItems = [...seedData];
        }
    }

    function saveDatabase() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(vaultItems));
        } catch (e) {
            console.error("Could not write record states.", e);
        }
    }

    function escapeMarkup(rawText) {
        if (!rawText) return "";
        return String(rawText)
            .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    function highlightTextMatches(sourceText, regexPattern) {
        const safeText = escapeMarkup(sourceText);
        if (!regexPattern) return safeText;
        try {
            const flags = regexPattern.ignoreCase ? "gi" : "g";
            const compileMatcher = new RegExp(regexPattern.source, flags);
            return safeText.replace(compileMatcher, function (m) {
                return "<mark>" + m + "</mark>";
            });
        } catch (e) {
            return safeText;
        }
    }

    function updateMetricsDashboard() {
        DOM.statTotal.textContent = vaultItems.length;

        let totalPagesSum = 0;
        const tagCounts = {};
        let dominantTag = "None";
        let peakFrequency = 0;

        for (let i = 0; i < vaultItems.length; i++) {
            totalPagesSum += vaultItems[i].pages;
            const itemTags = vaultItems[i].tags.split("/");
            for (let j = 0; j < itemTags.length; j++) {
                const currentTag = itemTags[j];
                tagCounts[currentTag] = (tagCounts[currentTag] || 0) + 1;
                if (tagCounts[currentTag] > peakFrequency) {
                    peakFrequency = tagCounts[currentTag];
                    dominantTag = currentTag;
                }
            }
        }
        DOM.statSumPages.textContent = totalPagesSum + " pages";
        DOM.statTopTag.textContent = dominantTag;

        DOM.trendChartBars.innerHTML = "";
        const nowTime = new Date();
        for (let d = 6; d >= 0; d--) {
            const trackingDate = new Date();
            trackingDate.setDate(nowTime.getDate() - d);
            const dateStringISO = trackingDate.toISOString().split('T')[0];
            
            let countForDay = 0;
            for (let x = 0; x < vaultItems.length; x++) {
                if (vaultItems[x].date === dateStringISO) {
                    countForDay++;
                }
            }

            const scaleHeight = Math.min(countForDay * 25, 100);
            const displayLabel = trackingDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

            const barColumn = document.createElement("div");
            barColumn.className = "chart-bar-column";
            barColumn.innerHTML = 
                '<div class="chart-bar-fill" style="height: ' + scaleHeight + 'px;" title="' + countForDay + ' entries"></div>' +
                '<span class="chart-bar-label">' + displayLabel + '</span>';
            DOM.trendChartBars.appendChild(barColumn);
        }

        const thresholdLimit = parseInt(DOM.inputLimit.value, 10) || 5;
        if (vaultItems.length > thresholdLimit) {
            DOM.capMessage.textContent = "Warning: Maximum capacity target exceeded! (" + vaultItems.length + "/" + thresholdLimit + ")";
            DOM.capMessage.className = "live-alert alert-triggered";
        } else {
            DOM.capMessage.textContent = "Status: Storage allocation safe.";
            DOM.capMessage.className = "live-alert";
        }
    }

    function renderVaultCollection(filterRegex = null) {
        DOM.itemsContainer.innerHTML = "";
        if (vaultItems.length === 0) {
            DOM.itemsContainer.innerHTML = '<p class="empty-placeholder">No active resource records saved inside local index configurations.</p>';
            return;
        }

        const activeEditId = DOM.editRecordId.value;

        for (let i = 0; i < vaultItems.length; i++) {
            const targetItem = vaultItems[i];
            if (filterRegex) {
                const passesSearch = filterRegex.test(targetItem.title) || filterRegex.test(targetItem.tags) || filterRegex.test(targetItem.advanced);
                if (!passesSearch) continue;
            }

            const itemArticle = document.createElement("article");
            itemArticle.className = "vault-article" + (targetItem.id === activeEditId ? " editing-active-state" : "");
            
            const highlightedTitle = highlightTextMatches(targetItem.title, filterRegex);
            const highlightedTags = highlightTextMatches(targetItem.tags, filterRegex);
            const highlightedAdvanced = highlightTextMatches(targetItem.advanced, filterRegex);

            itemArticle.innerHTML = 
                '<h3>' + highlightedTitle + '</h3>' +
                '<p><strong>Pages/Length Metrics:</strong> ' + escapeMarkup(targetItem.pages) + ' sheets</p>' +
                '<p><strong>Date Added Logged:</strong> ' + escapeMarkup(targetItem.date) + '</p>' +
                '<p><strong>Classifications Elements:</strong> <span class="tag-badge">' + highlightedTags + '</span></p>' +
                '<p class="advanced-field-log"><strong>Advanced Tracking String Data:</strong> ' + highlightedAdvanced + '</p>' +
                '<button type="button" class="edit-item-btn" data-id="' + targetItem.id + '">Edit</button>' +
                '<button type="button" class="delete-item-btn" data-id="' + targetItem.id + '">Remove</button>';
            
            itemArticle.querySelector(".delete-item-btn").addEventListener("click", function (e) {
                if (confirm("Are you sure you want to permanently clear this vault entry?")) {
                    removeEntryRecord(e.target.getAttribute("data-id"));
                }
            });

            itemArticle.querySelector(".edit-item-btn").addEventListener("click", function (e) {
                triggerInlineEditMode(e.target.getAttribute("data-id"));
            });

            DOM.itemsContainer.appendChild(itemArticle);
        }
    }
    function triggerInlineEditMode(recordId) {

        const itemToEdit = vaultItems.find(function (item) { return item.id === recordId; });
           if (!itemToEdit) return;
DOM.editRecordId.value = itemToEdit.id;
DOM.inputTitle.value = itemToEdit.title;
DOM.inputPages.value = itemToEdit.pages;
DOM.inputDate.value = itemToEdit.date;
DOM.inputTags.value = itemToEdit.tags;
DOM.inputAdvanced.value = itemToEdit.advanced;
DOM.submitFormBtn.textContent = "Update Resource Entry";
DOM.cancelEditBtn.style.display = "block";
renderVaultCollection(null);
document.getElementById("form-section").scrollIntoView({ behavior: 'smooth' });
}
function cancelFormEditState() {
DOM.editRecordId.value = "";
DOM.form.reset();
DOM.submitFormBtn.textContent = "Save Resource Entry to Vault";
DOM.cancelEditBtn.style.display = "none";
renderVaultCollection(null);
}
function removeEntryRecord(recordId) {
vaultItems = vaultItems.filter(function (item) { return item.id !== recordId; });
saveDatabase();
updateMetricsDashboard();
applyActiveFilteringView();
}
function validateFormInputs() {
let isFormValid = true;
DOM.errTitle.textContent = ""; DOM.errPages.textContent = ""; DOM.errDate.textContent = ""; DOM.errTags.textContent = ""; DOM.errAdvanced.textContent = "";
if (DOM.inputTitle.value.length < 4 || !REGEX_RULES.title.test(DOM.inputTitle.value)) {
DOM.errTitle.textContent = "Error: Input format invalid."; isFormValid = false;
}
if (!REGEX_RULES.pages.test(DOM.inputPages.value)) {
DOM.errPages.textContent = "Error: Value out of range."; isFormValid = false;
}
if (!REGEX_RULES.date.test(DOM.inputDate.value)) {
DOM.errDate.textContent = "Error: Invalid calendar date footprint mapping target sequences."; isFormValid = false;
}
if (!REGEX_RULES.tags.test(DOM.inputTags.value)) {
DOM.errTags.textContent = "Error: Format requires exclusively lowercase tokens separated by slashes."; isFormValid = false;
}
if (!REGEX_RULES.advanced.test(DOM.inputAdvanced.value)) {
DOM.errAdvanced.textContent = "Error: Validation target requires consecutive repeating word patterns."; isFormValid = false;
}
return isFormValid;
}
function handleFormSubmission(event) {
event.preventDefault();
if (!validateFormInputs()) return;
const targetId = DOM.editRecordId.value;
if (targetId) {
const itemIndex = vaultItems.findIndex(function (item) { return item.id === targetId; });
if (itemIndex !== -1) {
vaultItems[itemIndex].title = DOM.inputTitle.value.trim();
vaultItems[itemIndex].pages = parseInt(DOM.inputPages.value, 10);
vaultItems[itemIndex].date = DOM.inputDate.value.trim();
vaultItems[itemIndex].tags = DOM.inputTags.value.trim();
vaultItems[itemIndex].advanced = DOM.inputAdvanced.value.trim();
vaultItems[itemIndex].updatedAt = new Date().toISOString();
}
DOM.editRecordId.value = "";
DOM.submitFormBtn.textContent = "Save Resource Entry to Vault";
DOM.cancelEditBtn.style.display = "none";
} else {
vaultItems.push({
id: "rec_" + Date.now(),
title: DOM.inputTitle.value.trim(),
pages: parseInt(DOM.inputPages.value, 10),
date: DOM.inputDate.value.trim(),
tags: DOM.inputTags.value.trim(),
advanced: DOM.inputAdvanced.value.trim(),
createdAt: new Date().toISOString(),
updatedAt: new Date().toISOString()
});
}
saveDatabase();
updateMetricsDashboard();
applyActiveFilteringView();
DOM.form.reset();
}
function applyActiveFilteringView() {
const searchQuery = DOM.searchField.value;
DOM.searchError.textContent = "";
if (!searchQuery) { renderVaultCollection(null); return; }
try {
renderVaultCollection(new RegExp(searchQuery, "i"));
} catch (e) {
DOM.searchError.textContent = "Syntax Status: Incomplete expression pattern composition...";
}
}
function sortVaultCollectionBy(sortingCriteria) {
if (sortingCriteria === "title") {
vaultItems.sort(function (a, b) { return a.title.localeCompare(b.title); });
} else if (sortingCriteria === "pages") {
vaultItems.sort(function (a, b) { return a.pages - b.pages; });
} else if (sortingCriteria === "date") {
vaultItems.sort(function (a, b) { return new Date(a.date) - new Date(b.date); });
}
applyActiveFilteringView();
}
function exportDatabaseString() {
DOM.importArea.value = JSON.stringify(vaultItems, null, 2);
}
function importDatabaseString() {
DOM.importError.textContent = "";
try {
const parsedDataRecords = JSON.parse(DOM.importArea.value.trim());
if (!Array.isArray(parsedDataRecords)) return;
vaultItems = parsedDataRecords;
saveDatabase();
updateMetricsDashboard();
applyActiveFilteringView();
DOM.importArea.value = "";
} catch (e) {
DOM.importError.textContent = "Exception Error: Code structure parsing broken.";
}
}
function executeScrapingSandboxParser() {
const htmlSnippet = DOM.scrapeInput.value;
if (!htmlSnippet.trim()) return;
const extractAnchorTextPattern = /<a\s+[^>]*href=(['"])(.*?)\1[^>]*>([\s\S]*?)<\/a>/gi;
let m; let collector = ""; let count = 0;
while ((m = extractAnchorTextPattern.exec(htmlSnippet)) !== null) {
count++;
collector += "Link " + count + ": URI: " + escapeMarkup(m[2]) + " Content: '" + escapeMarkup(m[3].replace(/<[^>]*>/g, "").trim()) + "'";
}
DOM.scrapeOutput.innerHTML = count === 0 ? "0 anchor patterns parsed." : collector;
}
function executeMetricUnitConversion() {
const inputVal = parseFloat(DOM.convertInput.value) || 0;
const selectMode = DOM.convertMode.value;
if (selectMode === "pages-to-chapters") {
DOM.conversionResult.textContent = (inputVal / 20).toFixed(2) + " Chapters";
} else {
DOM.conversionResult.textContent = (inputVal * 20).toFixed(0) + " Pages";
}
}
function initializeApplicationWiring() {
loadDatabase(); updateMetricsDashboard(); renderVaultCollection(null); executeMetricUnitConversion();
DOM.form.addEventListener("submit", handleFormSubmission);
DOM.cancelEditBtn.addEventListener("click", cancelFormEditState);
DOM.searchField.addEventListener("input", applyActiveFilteringView);
DOM.inputLimit.addEventListener("input", updateMetricsDashboard);
DOM.convertInput.addEventListener("input", executeMetricUnitConversion);
DOM.convertMode.addEventListener("change", executeMetricUnitConversion);
DOM.sortTitleBtn.addEventListener("click", function () { sortVaultCollectionBy("title"); });
DOM.sortPagesBtn.addEventListener("click", function () { sortVaultCollectionBy("pages"); });
DOM.sortDateBtn.addEventListener("click", function () { sortVaultCollectionBy("date"); });
DOM.exportBtn.addEventListener("click", exportDatabaseString);
DOM.importBtn.addEventListener("click", importDatabaseString);
DOM.scrapeExecute.addEventListener("click", executeScrapingSandboxParser);
}
document.addEventListener("DOMContentLoaded", initializeApplicationWiring);
})();
