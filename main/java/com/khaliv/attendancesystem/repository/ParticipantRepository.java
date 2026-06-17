package com.khaliv.attendancesystem.repository;

import com.khaliv.attendancesystem.entity.Participant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParticipantRepository extends JpaRepository<Participant, Long> {
}