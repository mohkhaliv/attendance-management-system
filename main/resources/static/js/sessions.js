const API_URL = "/api/sessions";

const sessionForm = document.getElementById("sessionForm");
const sessionTableBody = document.getElementById(
    "sessionTableBody"
);

const sessionCount = document.getElementById("sessionCount");
const tableMessage = document.getElementById("tableMessage");
const formMessage = document.getElementById("formMessage");

const formTitle = document.getElementById("formTitle");
const submitButton = document.getElementById("submitButton");
const cancelButton = document.getElementById("cancelButton");
const refreshButton = document.getElementById("refreshButton");

let editingSessionId = null;

async function loadSessions() {
    tableMessage.textContent = "Loading sessions...";
    sessionTableBody.innerHTML = "";

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(
                `Failed to load sessions: ${response.status}`
            );
        }

        const sessions = await response.json();

        sessionCount.textContent =
            `Total sessions: ${sessions.length}`;

        if (sessions.length === 0) {
            tableMessage.textContent = "No sessions found.";
            return;
        }

        tableMessage.textContent = "";

        sessions.forEach(session => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${session.id}</td>
                <td>${session.title}</td>
                <td>${session.sessionDate}</td>
                <td>${session.topic}</td>
                <td>${session.mentor}</td>
                <td class="action-buttons">
                    <button
                        class="edit-button"
                        data-id="${session.id}"
                    >
                        Edit
                    </button>

                    <button
                        class="delete-button"
                        data-id="${session.id}"
                    >
                        Delete
                    </button>
                </td>
            `;

            const editButton = row.querySelector(".edit-button");
            const deleteButton = row.querySelector(".delete-button");

            editButton.addEventListener("click", () => {
                startEditingSession(session);
            });

            deleteButton.addEventListener("click", () => {
                deleteSession(session.id, session.title);
            });

            sessionTableBody.appendChild(row);
        });
    } catch (error) {
        console.error(error);
        tableMessage.textContent = "Failed to load sessions.";
    }
}

sessionForm.addEventListener("submit", async event => {
    event.preventDefault();

    const sessionData = Object.fromEntries(
        new FormData(sessionForm)
    );

    const isEditing = editingSessionId !== null;

    const url = isEditing
        ? `${API_URL}/${editingSessionId}`
        : API_URL;

    const method = isEditing ? "PUT" : "POST";

    submitButton.disabled = true;

    formMessage.textContent = isEditing
        ? "Updating session..."
        : "Adding session...";

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(sessionData)
        });

        if (!response.ok) {
            throw new Error(
                `Failed to save session: ${response.status}`
            );
        }

        const savedSession = await response.json();

        formMessage.textContent = isEditing
            ? `${savedSession.title} successfully updated.`
            : `${savedSession.title} successfully added.`;

        resetForm();
        await loadSessions();
    } catch (error) {
        console.error(error);
        formMessage.textContent = "Failed to save session.";
    } finally {
        submitButton.disabled = false;
    }
});

function startEditingSession(session) {
    editingSessionId = session.id;

    sessionForm.elements.title.value = session.title;
    sessionForm.elements.sessionDate.value = session.sessionDate;
    sessionForm.elements.topic.value = session.topic;
    sessionForm.elements.mentor.value = session.mentor;

    formTitle.textContent = "Edit Training Session";
    submitButton.textContent = "Save Changes";
    cancelButton.classList.remove("hidden");

    formMessage.textContent =
        `Editing session: ${session.title}`;

    sessionForm.elements.title.focus();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

async function deleteSession(id, title) {
    const confirmed = window.confirm(
        `Delete session "${title}"?`
    );

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error(
                `Failed to delete session: ${response.status}`
            );
        }

        formMessage.textContent =
            `${title} successfully deleted.`;

        if (editingSessionId === id) {
            resetForm();
        }

        await loadSessions();
    } catch (error) {
        console.error(error);

        formMessage.textContent =
            "Failed to delete session. The session may still have attendance records.";
    }
}

function resetForm() {
    editingSessionId = null;

    sessionForm.reset();

    formTitle.textContent = "Add Training Session";
    submitButton.textContent = "Add Session";
    cancelButton.classList.add("hidden");
}

cancelButton.addEventListener("click", () => {
    resetForm();
    formMessage.textContent = "Edit cancelled.";
});

refreshButton.addEventListener("click", loadSessions);

loadSessions();