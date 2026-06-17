package com.khaliv.attendancesystem.controller;

import com.khaliv.attendancesystem.dto.AttendanceRequest;
import com.khaliv.attendancesystem.entity.Attendance;
import com.khaliv.attendancesystem.service.AttendanceService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendances")
@CrossOrigin(origins = "*")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(
            AttendanceService attendanceService
    ) {
        this.attendanceService = attendanceService;
    }

    @GetMapping
    public List<Attendance> getAllAttendances() {
        return attendanceService.getAllAttendances();
    }

    @GetMapping("/{id}")
    public Attendance getAttendanceById(
            @PathVariable Long id
    ) {
        return attendanceService.getAttendanceById(id);
    }

    @GetMapping("/session/{sessionId}")
    public List<Attendance> getAttendancesBySession(
            @PathVariable Long sessionId
    ) {
        return attendanceService
                .getAttendancesBySession(sessionId);
    }

    @GetMapping("/participant/{participantId}")
    public List<Attendance> getAttendancesByParticipant(
            @PathVariable Long participantId
    ) {
        return attendanceService
                .getAttendancesByParticipant(participantId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Attendance createAttendance(
            @RequestBody AttendanceRequest request
    ) {
        return attendanceService.createAttendance(request);
    }

    @PutMapping("/{id}")
    public Attendance updateAttendance(
            @PathVariable Long id,
            @RequestBody AttendanceRequest request
    ) {
        return attendanceService
                .updateAttendance(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAttendance(
            @PathVariable Long id
    ) {
        attendanceService.deleteAttendance(id);
    }
}