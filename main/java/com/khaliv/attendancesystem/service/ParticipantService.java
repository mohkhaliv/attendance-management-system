package com.khaliv.attendancesystem.service;

import com.khaliv.attendancesystem.entity.Participant;
import com.khaliv.attendancesystem.repository.ParticipantRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ParticipantService {

    private final ParticipantRepository participantRepository;

    public ParticipantService(ParticipantRepository participantRepository) {
        this.participantRepository = participantRepository;
    }

    public List<Participant> getAllParticipants() {
        return participantRepository.findAll();
    }

    public Participant createParticipant(Participant participant) {
        return participantRepository.save(participant);
    }

    public void deleteParticipant(Long id) {
        participantRepository.deleteById(id);
    }
    public Participant updateParticipant(Long id, Participant updatedParticipant) {
        Participant participant = participantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Participant not found with id: " + id));

        participant.setName(updatedParticipant.getName());
        participant.setEmail(updatedParticipant.getEmail());
        participant.setPhone(updatedParticipant.getPhone());
        participant.setBatchName(updatedParticipant.getBatchName());

        return participantRepository.save(participant);
    }
}