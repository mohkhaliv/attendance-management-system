
const PARTICIPANT_API = "/api/participants";
const SESSION_API = "/api/sessions";
const ATTENDANCE_API = "/api/attendances";

const sessionSelect = document.getElementById("sessionSelect");
const attendanceTableBody = document.getElementById(
    "attendanceTableBody"
);

const attendanceMessage = document.getElementById(
    "attendanceMessage"
);
const tableMessage = document.getElementById("tableMessage");
const participantCount = document.getElementById(
    "participantCount"
);

const saveAllButton = document.getElementById("saveAllButton");
const refreshButton = document.getElementById("refreshButton");

const presentCount = document.getElementById("presentCount");
const lateCount = document.getElementById("lateCount");
const absentCount = document.getElementById("absentCount");
const excusedCount = document.getElementById("excusedCount");

let participants = [];
let sessions = [];
let attendanceByParticipant = new Map();

async function loadInitialData() {
    attendanceMessage.textContent = "Loading data...";
    attendanceTableBody.innerHTML = "";
    resetSummary();

    try {
        const [participantResponse, sessionResponse] =
            await Promise.all([
                fetch(PARTICIPANT_API),
                fetch(SESSION_API)
            ]);

        if (!participantResponse.ok) {
            throw new Error(
                `Failed to load participants: ${participantResponse.status}`
            );
        }

        if (!sessionResponse.ok) {
            throw new Error(
                `Failed to load sessions: ${sessionResponse.status}`
            );
        }

        participants = await participantResponse.json();
        sessions = await sessionResponse.json();

        populateSessionSelect();

        participantCount.textContent =
            `Total participants: ${participants.length}`;

        if (sessions.length === 0) {
            attendanceMessage.textContent =
                "No training sessions found. Create a session first.";

            tableMessage.textContent =
                "Attendance cannot be managed without a session.";

            return;
        }

        if (participants.length === 0) {
            attendanceMessage.textContent =
                "No participants found. Add participants first.";

            tableMessage.textContent =
                "There are no participants to display.";

            return;
        }

        if (!sessionSelect.value) {
            sessionSelect.value = sessions[0].id;
        }

        await loadAttendanceForSelectedSession();
    } catch (error) {
        console.error(error);

        attendanceMessage.textContent =
            "Failed to load attendance data.";
    }
}

function populateSessionSelect() {
    const selectedSessionId = sessionSelect.value;

    sessionSelect.innerHTML =
        '<option value="">Select a session</option>';

    sessions.forEach(session => {
        const option = document.createElement("option");

        option.value = session.id;
        option.textContent =
            `${session.title} — ${session.sessionDate}`;

        sessionSelect.appendChild(option);
    });

    const selectedStillExists = sessions.some(
        session => String(session.id) === selectedSessionId
    );

    if (selectedStillExists) {
        sessionSelect.value = selectedSessionId;
    }
}

async function loadAttendanceForSelectedSession() {
    const sessionId = sessionSelect.value;

    attendanceTableBody.innerHTML = "";
    attendanceByParticipant.clear();
    resetSummary();

    if (!sessionId) {
        tableMessage.textContent =
            "Select a training session first.";

        return;
    }

    tableMessage.textContent = "Loading attendance...";
    attendanceMessage.textContent = "";

    try {
        const response = await fetch(
            `${ATTENDANCE_API}/session/${sessionId}`
        );

        if (!response.ok) {
            throw new Error(
                `Failed to load attendance: ${response.status}`
            );
        }

        const attendances = await response.json();

        attendances.forEach(attendance => {
            attendanceByParticipant.set(
                attendance.participant.id,
                attendance
            );
        });

        renderAttendanceRows();

        tableMessage.textContent = "";
    } catch (error) {
        console.error(error);

        tableMessage.textContent =
            "Failed to load attendance records.";
    }
}

function renderAttendanceRows() {
    attendanceTableBody.innerHTML = "";

    participants.forEach(participant => {
        const existingAttendance =
            attendanceByParticipant.get(participant.id);

        const row = document.createElement("tr");

        row.dataset.participantId = participant.id;
        row.dataset.attendanceId =
            existingAttendance?.id ?? "";

        row.dataset.savedStatus =
            existingAttendance?.status ?? "";

        row.innerHTML = `
            <td>${escapeHtml(participant.name)}</td>
            <td>${escapeHtml(participant.batchName)}</td>
            <td>${escapeHtml(participant.email)}</td>

            <td>
                <select class="attendance-status">
                    <option value="PRESENT">Present</option>
                    <option value="LATE">Late</option>
                    <option value="ABSENT">Absent</option>
                    <option value="EXCUSED">Excused</option>
                </select>
            </td>

            <td>
                <input
                    class="attendance-note"
                    type="text"
                    placeholder="Optional note"
                >
            </td>

            <td class="action-buttons">
                <button
                    class="save-button"
                    type="button"
                >
                    ${existingAttendance ? "Update" : "Save"}
                </button>

                <button
                    class="delete-button clear-button"
                    type="button"
                    ${existingAttendance ? "" : "disabled"}
                >
                    Clear
                </button>
            </td>
        `;

        const statusSelect = row.querySelector(
            ".attendance-status"
        );

        const noteInput = row.querySelector(
            ".attendance-note"
        );

        const saveButton = row.querySelector(
            ".save-button"
        );

        const clearButton = row.querySelector(
            ".clear-button"
        );

        statusSelect.value =
            existingAttendance?.status ?? "PRESENT";

        noteInput.value =
            existingAttendance?.note ?? "";

        saveButton.addEventListener("click", async () => {
            await saveAttendanceRow(row);
        });

        clearButton.addEventListener("click", async () => {
            await clearAttendanceRow(row);
        });

        attendanceTableBody.appendChild(row);
    });

    updateSummary();
}

async function saveAttendanceRow(row) {
    const participantId = Number(
        row.dataset.participantId
    );

    const attendanceId = row.dataset.attendanceId;
    const sessionId = Number(sessionSelect.value);

    const status = row.querySelector(
        ".attendance-status"
    ).value;

    const note = row.querySelector(
        ".attendance-note"
    ).value.trim();

    const saveButton = row.querySelector(
        ".save-button"
    );

    const clearButton = row.querySelector(
        ".clear-button"
    );

    const isEditing = Boolean(attendanceId);

    const url = isEditing
        ? `${ATTENDANCE_API}/${attendanceId}`
        : ATTENDANCE_API;

    const method = isEditing ? "PUT" : "POST";

    const attendanceData = {
        participantId,
        sessionId,
        status,
        note
    };

    saveButton.disabled = true;
    saveButton.textContent = "Saving...";

    try {
        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(attendanceData)
        });

        if (!response.ok) {
            const errorMessage =
                await getResponseError(response);

            throw new Error(errorMessage);
        }

        const savedAttendance = await response.json();

        row.dataset.attendanceId =
            savedAttendance.id;

        row.dataset.savedStatus =
            savedAttendance.status;

        saveButton.textContent = "Update";
        clearButton.disabled = false;

        attendanceMessage.textContent =
            `${savedAttendance.participant.name}: ` +
            `${savedAttendance.status} saved successfully.`;

        updateSummary();

        return true;
    } catch (error) {
        console.error(error);

        attendanceMessage.textContent =
            `Failed to save attendance: ${error.message}`;

        return false;
    } finally {
        saveButton.disabled = false;

        if (!row.dataset.attendanceId) {
            saveButton.textContent = "Save";
        }
    }
}

async function clearAttendanceRow(row) {
    const attendanceId = row.dataset.attendanceId;

    if (!attendanceId) {
        return;
    }

    const confirmed = window.confirm(
        "Delete this attendance record?"
    );

    if (!confirmed) {
        return;
    }

    const clearButton = row.querySelector(
        ".clear-button"
    );

    clearButton.disabled = true;
    clearButton.textContent = "Clearing...";

    try {
        const response = await fetch(
            `${ATTENDANCE_API}/${attendanceId}`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {
            const errorMessage =
                await getResponseError(response);

            throw new Error(errorMessage);
        }

        row.dataset.attendanceId = "";
        row.dataset.savedStatus = "";

        row.querySelector(
            ".attendance-status"
        ).value = "PRESENT";

        row.querySelector(
            ".attendance-note"
        ).value = "";

        row.querySelector(
            ".save-button"
        ).textContent = "Save";

        attendanceMessage.textContent =
            "Attendance record successfully cleared.";

        updateSummary();
    } catch (error) {
        console.error(error);

        attendanceMessage.textContent =
            `Failed to clear attendance: ${error.message}`;

        clearButton.disabled = false;
    } finally {
        clearButton.textContent = "Clear";
    }
}

saveAllButton.addEventListener("click", async () => {
    const sessionId = sessionSelect.value;

    if (!sessionId) {
        attendanceMessage.textContent =
            "Select a training session first.";

        return;
    }

    const rows = [
        ...attendanceTableBody.querySelectorAll("tr")
    ];

    if (rows.length === 0) {
        attendanceMessage.textContent =
            "There are no participants to save.";

        return;
    }

    saveAllButton.disabled = true;
    saveAllButton.textContent = "Saving All...";

    let successCount = 0;

    for (const row of rows) {
        const success = await saveAttendanceRow(row);

        if (success) {
            successCount++;
        }
    }

    attendanceMessage.textContent =
        `${successCount} of ${rows.length} attendance records saved.`;

    saveAllButton.disabled = false;
    saveAllButton.textContent = "Save All Attendance";
});

function updateSummary() {
    const rows = attendanceTableBody.querySelectorAll("tr");

    const totals = {
        PRESENT: 0,
        LATE: 0,
        ABSENT: 0,
        EXCUSED: 0
    };

    rows.forEach(row => {
        const savedStatus = row.dataset.savedStatus;

        if (
            savedStatus &&
            totals[savedStatus] !== undefined
        ) {
            totals[savedStatus]++;
        }
    });

    presentCount.textContent = totals.PRESENT;
    lateCount.textContent = totals.LATE;
    absentCount.textContent = totals.ABSENT;
    excusedCount.textContent = totals.EXCUSED;
}

function resetSummary() {
    presentCount.textContent = "0";
    lateCount.textContent = "0";
    absentCount.textContent = "0";
    excusedCount.textContent = "0";
}

async function getResponseError(response) {
    try {
        const errorData = await response.json();

        return errorData.message ??
            `HTTP error: ${response.status}`;
    } catch {
        return `HTTP error: ${response.status}`;
    }
}

function escapeHtml(value) {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

sessionSelect.addEventListener(
    "change",
    loadAttendanceForSelectedSession
);

refreshButton.addEventListener(
    "click",
    loadInitialData
);

loadInitialData();

