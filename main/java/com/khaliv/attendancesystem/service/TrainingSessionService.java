package com.khaliv.attendancesystem.service;

import com.khaliv.attendancesystem.entity.TrainingSession;
import com.khaliv.attendancesystem.repository.TrainingSessionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrainingSessionService {
    private final TrainingSessionRepository trainingSessionRepository;
    public TrainingSessionService(TrainingSessionRepository trainingSessionRepository) {
        this.trainingSessionRepository = trainingSessionRepository;
    }

    public List<TrainingSession> getAllSessions() {
        return trainingSessionRepository.findAll();
    }

    public TrainingSession createSession(TrainingSession trainingSession) {
        return trainingSessionRepository.save(trainingSession);
    }

    public void deleteSession(Long id) {
        trainingSessionRepository.deleteById(id);
    }

    public TrainingSession updateSession(Long id, TrainingSession updatedSession) {
        TrainingSession session = trainingSessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session not found with id: " + id));
        session.setTitle(updatedSession.getTitle());
        session.setSessionDate(updatedSession.getSessionDate());
        session.setTopic(updatedSession.getTopic());
        session.setMentor(updatedSession.getMentor());

        return trainingSessionRepository.save(session);
    }
}