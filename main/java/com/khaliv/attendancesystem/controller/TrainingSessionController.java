package com.khaliv.attendancesystem.controller;

import com.khaliv.attendancesystem.entity.TrainingSession;
import com.khaliv.attendancesystem.service.TrainingSessionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin(origins = "*")
public class TrainingSessionController {
    private final TrainingSessionService trainingSessionService;
    public TrainingSessionController(TrainingSessionService trainingSessionService) {
        this.trainingSessionService = trainingSessionService;
    }

    @GetMapping
    public List<TrainingSession> getAllSessions() {
        return trainingSessionService.getAllSessions();
    }

    @PostMapping
    public TrainingSession createSession(@RequestBody TrainingSession trainingSession) {
        return trainingSessionService.createSession(trainingSession);
    }

    @DeleteMapping("/{id}")
    public void deleteSession(@PathVariable Long id) {
        trainingSessionService.deleteSession(id);
    }

    @PutMapping("/{id}")
    public TrainingSession editSession(@PathVariable Long id, @RequestBody TrainingSession trainingSession) {
        return trainingSessionService.updateSession(id, trainingSession);
    }
}

