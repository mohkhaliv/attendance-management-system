package com.khaliv.attendancesystem.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "participants")
public class Participant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String phone;

    @Column(name = "batch_name")
    private String batchName;

    public Participant() {
    }

    public Participant(Long id, String name, String email, String phone, String batchName) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.batchName = batchName;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getBatchName() {
        return batchName;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setBatchName(String batchName) {
        this.batchName = batchName;
    }
}