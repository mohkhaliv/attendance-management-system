package com.khaliv.attendancesystem.dto;

import com.khaliv.attendancesystem.entity.AttendanceStatus;

public class AttendanceRequest {

    private Long participantId;
    private Long sessionId;
    private AttendanceStatus status;
    private String note;

    public AttendanceRequest() {
    }

    public AttendanceRequest(
            Long participantId,
            Long sessionId,
            AttendanceStatus status,
            String note
    ) {
        this.participantId = participantId;
        this.sessionId = sessionId;
        this.status = status;
        this.note = note;
    }

    public Long getParticipantId() {
        return participantId;
    }

    public void setParticipantId(Long participantId) {
        this.participantId = participantId;
    }

    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public AttendanceStatus getStatus() {
        return status;
    }

    public void setStatus(AttendanceStatus status) {
        this.status = status;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}