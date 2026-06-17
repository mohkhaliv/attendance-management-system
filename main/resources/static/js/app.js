const API_URL = "/api/participants";

const participantForm = document.getElementById("participantForm");
const participantTableBody = document.getElementById(
    "participantTableBody"
);

const participantCount = document.getElementById("participantCount");
const tableMessage = document.getElementById("tableMessage");
const formMessage = document.getElementById("formMessage");

const formTitle = document.getElementById("formTitle");
const submitButton = document.getElementById("submitButton");
const cancelButton = document.getElementById("cancelButton");
const refreshButton = document.getElementById("refreshButton");

let editingParticipantId = null;

async function loadParticipants() {
    tableMessage.textContent = "Loading participants...";
    participantTableBody.innerHTML = "";

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(
                `Failed to load participants: ${response.status}`
            );
        }

        const participants = await response.json();

        participantCount.textContent =
            `Total participants: ${participants.length}`;

        if (participants.length === 0) {
            tableMessage.textContent = "No participants found.";
            return;
        }

        tableMessage.textContent = "";

        participants.forEach(participant => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${participant.id}</td>
                <td>${participant.name}</td>
                <td>${participant.email}</td>
                <td>${participant.phone}</td>
                <td>${participant.batchName}</td>
                <td class="action-buttons">
                    <button
                        class="edit-button"
                        data-id="${participant.id}"
                    >
                        Edit
                    </button>

                    <button
                        class="delete-button"
                        data-id="${participant.id}"
                    >
                        Delete
                    </button>
                </td>
            `;

            const editButton = row.querySelector(".edit-button");
            const deleteButton = row.querySelector(".delete-button");

            editButton.addEventListener("click", () => {
                startEditingParticipant(participant);
            });

            deleteButton.addEventListener("click", () => {
                deleteParticipant(participant.id, participant.name);
            });

            participantTableBody.appendChild(row);
        });
    } catch (error) {
        console.error(error);
        tableMessage.textContent = "Failed to load participants.";
    }
}

participantForm.addEventListener("submit", async event => {
    event.preventDefault();

    const participantData = Object.fromEntries(
        new FormData(participantForm)
    );

    const isEditing = editingParticipantId !== null;

    const url = isEditing
        ? `${API_URL}/${editingParticipantId}`
        : API_URL;

    const method = isEditing ? "PUT" : "POST";

    submitButton.disabled = true;
    formMessage.textContent = isEditing
        ? "Updating participant..."
        : "Adding participant...";

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(participantData)
        });

        if (!response.ok) {
            throw new Error(
                `Failed to save participant: ${response.status}`
            );
        }

        const savedParticipant = await response.json();

        formMessage.textContent = isEditing
            ? `${savedParticipant.name} successfully updated.`
            : `${savedParticipant.name} successfully added.`;

        resetForm();
        await loadParticipants();
    } catch (error) {
        console.error(error);
        formMessage.textContent = "Failed to save participant.";
    } finally {
        submitButton.disabled = false;
    }
});

function startEditingParticipant(participant) {
    editingParticipantId = participant.id;

    participantForm.elements.name.value = participant.name;
    participantForm.elements.email.value = participant.email;
    participantForm.elements.phone.value = participant.phone;
    participantForm.elements.batchName.value = participant.batchName;

    formTitle.textContent = "Edit Participant";
    submitButton.textContent = "Save Changes";
    cancelButton.classList.remove("hidden");

    formMessage.textContent =
        `Editing participant: ${participant.name}`;

    participantForm.elements.name.focus();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

async function deleteParticipant(id, name) {
    const confirmed = window.confirm(
        `Delete participant "${name}"?`
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
                `Failed to delete participant: ${response.status}`
            );
        }

        formMessage.textContent =
            `${name} successfully deleted.`;

        if (editingParticipantId === id) {
            resetForm();
        }

        await loadParticipants();
    } catch (error) {
        console.error(error);
        formMessage.textContent =
            "Failed to delete participant. It may still be linked to attendance data.";
    }
}

function resetForm() {
    editingParticipantId = null;

    participantForm.reset();

    formTitle.textContent = "Add Participant";
    submitButton.textContent = "Add Participant";
    cancelButton.classList.add("hidden");
}

cancelButton.addEventListener("click", () => {
    resetForm();
    formMessage.textContent = "Edit cancelled.";
});

refreshButton.addEventListener("click", loadParticipants);

loadParticipants();