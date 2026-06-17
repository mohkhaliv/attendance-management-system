package com.khaliv.attendancesystem.controller;

import com.khaliv.attendancesystem.entity.Participant;
import com.khaliv.attendancesystem.service.ParticipantService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/participants")
@CrossOrigin(origins = "*")
public class ParticipantController {

    private final ParticipantService participantService;

    public ParticipantController(ParticipantService participantService) {
        this.participantService = participantService;
    }

    @GetMapping
    public List<Participant> getAllParticipants() {
        return participantService.getAllParticipants();
    }

    @PostMapping
    public Participant createParticipant(@RequestBody Participant participant) {
        return participantService.createParticipant(participant);
    }

    @DeleteMapping("/{id}")
    public void deleteParticipant(@PathVariable Long id) {
        participantService.deleteParticipant(id);
    }
    @PutMapping("/{id}")
    public Participant updateParticipant(
            @PathVariable Long id,
            @RequestBody Participant participant
    ) {
        return participantService.updateParticipant(id, participant);
    }
}