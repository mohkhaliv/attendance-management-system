package com.khaliv.attendancesystem.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "sessions")
public class TrainingSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(name = "session_date")
    private LocalDate sessionDate;

    private String topic;
    private String mentor;

    public TrainingSession() {
    }

    public TrainingSession(Long id, String title, LocalDate sessionDate, String topic, String mentor) {
        this.id = id;
        this.title = title;
        this.sessionDate = sessionDate;
        this.topic = topic;
        this.mentor = mentor;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public LocalDate getSessionDate() {
        return sessionDate;
    }

    public String getTopic() {
        return topic;
    }

    public String getMentor() {
        return mentor;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setSessionDate(LocalDate sessionDate) {
        this.sessionDate = sessionDate;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public void setMentor(String mentor) {
        this.mentor = mentor;
    }
}