package com.interviewprep.controller;

import com.interviewprep.model.InterviewSchedule;
import com.interviewprep.service.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedule")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleService scheduleService;

    @GetMapping("/my")
    public ResponseEntity<List<InterviewSchedule>> getMySchedules(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(scheduleService.getMySchedules(userDetails.getUsername()));
    }

    @PostMapping
    public ResponseEntity<InterviewSchedule> createSchedule(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody InterviewSchedule schedule) {
        return ResponseEntity.ok(scheduleService.createSchedule(userDetails.getUsername(), schedule));
    }

    @PutMapping("/{id}")
    public ResponseEntity<InterviewSchedule> updateSchedule(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody InterviewSchedule schedule) {
        return ResponseEntity.ok(scheduleService.updateSchedule(id, userDetails.getUsername(), schedule));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable Long id) {
        scheduleService.deleteSchedule(id);
        return ResponseEntity.noContent().build();
    }
}
