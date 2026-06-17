package com.khaliv.attendancesystem.repository;

import com.khaliv.attendancesystem.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttendanceRepository
        extends JpaRepository<Attendance, Long> {

    List<Attendance> findByTrainingSession_Id(Long sessionId);

    List<Attendance> findByParticipant_Id(Long participantId);

    boolean existsByParticipant_IdAndTrainingSession_Id(
            Long participantId,
            Long sessionId
    );
}