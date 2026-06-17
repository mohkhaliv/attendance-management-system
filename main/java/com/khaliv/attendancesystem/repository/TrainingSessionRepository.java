package com.khaliv.attendancesystem.repository;

import com.khaliv.attendancesystem.entity.TrainingSession;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrainingSessionRepository extends JpaRepository<TrainingSession, Long> {
}