package com.khaliv.attendancesystem.service;

import com.khaliv.attendancesystem.dto.AttendanceRequest;
import com.khaliv.attendancesystem.entity.Attendance;
import com.khaliv.attendancesystem.entity.Participant;
import com.khaliv.attendancesystem.entity.TrainingSession;
import com.khaliv.attendancesystem.exception.ResourceNotFoundException;
import com.khaliv.attendancesystem.repository.AttendanceRepository;
import com.khaliv.attendancesystem.repository.ParticipantRepository;
import com.khaliv.attendancesystem.repository.TrainingSessionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final ParticipantRepository participantRepository;
    private final TrainingSessionRepository trainingSessionRepository;

    public AttendanceService(
            AttendanceRepository attendanceRepository,
            ParticipantRepository participantRepository,
            TrainingSessionRepository trainingSessionRepository
    ) {
        this.attendanceRepository = attendanceRepository;
        this.participantRepository = participantRepository;
        this.trainingSessionRepository = trainingSessionRepository;
    }

    public List<Attendance> getAllAttendances() {
        return attendanceRepository.findAll();
    }

    public Attendance getAttendanceById(Long id) {
        return attendanceRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Attendance not found with id: " + id
                        )
                );
    }

    public List<Attendance> getAttendancesBySession(Long sessionId) {
        if (!trainingSessionRepository.existsById(sessionId)) {
            throw new ResourceNotFoundException(
                    "Training session not found with id: " + sessionId
            );
        }

        return attendanceRepository.findByTrainingSession_Id(sessionId);
    }

    public List<Attendance> getAttendancesByParticipant(
            Long participantId
    ) {
        if (!participantRepository.existsById(participantId)) {
            throw new ResourceNotFoundException(
                    "Participant not found with id: " + participantId
            );
        }

        return attendanceRepository.findByParticipant_Id(participantId);
    }

    public Attendance createAttendance(AttendanceRequest request) {
        validateRequest(request);

        Participant participant = participantRepository
                .findById(request.getParticipantId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Participant not found with id: "
                                        + request.getParticipantId()
                        )
                );

        TrainingSession trainingSession = trainingSessionRepository
                .findById(request.getSessionId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Training session not found with id: "
                                        + request.getSessionId()
                        )
                );

        boolean alreadyExists =
                attendanceRepository
                        .existsByParticipant_IdAndTrainingSession_Id(
                                request.getParticipantId(),
                                request.getSessionId()
                        );

        if (alreadyExists) {
            throw new IllegalArgumentException(
                    "This participant already has attendance "
                            + "for this training session"
            );
        }

        Attendance attendance = new Attendance();
        attendance.setParticipant(participant);
        attendance.setTrainingSession(trainingSession);
        attendance.setStatus(request.getStatus());
        attendance.setNote(request.getNote());

        return attendanceRepository.save(attendance);
    }

    public Attendance updateAttendance(
            Long id,
            AttendanceRequest request
    ) {
        validateRequest(request);

        Attendance attendance = getAttendanceById(id);

        Participant participant = participantRepository
                .findById(request.getParticipantId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Participant not found with id: "
                                        + request.getParticipantId()
                        )
                );

        TrainingSession trainingSession = trainingSessionRepository
                .findById(request.getSessionId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Training session not found with id: "
                                        + request.getSessionId()
                        )
                );

        boolean participantOrSessionChanged =
                !attendance.getParticipant().getId()
                        .equals(request.getParticipantId())
                        || !attendance.getTrainingSession().getId()
                        .equals(request.getSessionId());

        if (participantOrSessionChanged) {
            boolean alreadyExists =
                    attendanceRepository
                            .existsByParticipant_IdAndTrainingSession_Id(
                                    request.getParticipantId(),
                                    request.getSessionId()
                            );

            if (alreadyExists) {
                throw new IllegalArgumentException(
                        "This participant already has attendance "
                                + "for this training session"
                );
            }
        }

        attendance.setParticipant(participant);
        attendance.setTrainingSession(trainingSession);
        attendance.setStatus(request.getStatus());
        attendance.setNote(request.getNote());

        return attendanceRepository.save(attendance);
    }

    public void deleteAttendance(Long id) {
        Attendance attendance = getAttendanceById(id);
        attendanceRepository.delete(attendance);
    }

    private void validateRequest(AttendanceRequest request) {
        if (request.getParticipantId() == null) {
            throw new IllegalArgumentException(
                    "participantId is required"
            );
        }

        if (request.getSessionId() == null) {
            throw new IllegalArgumentException(
                    "sessionId is required"
            );
        }

        if (request.getStatus() == null) {
            throw new IllegalArgumentException(
                    "status is required"
            );
        }
    }
}