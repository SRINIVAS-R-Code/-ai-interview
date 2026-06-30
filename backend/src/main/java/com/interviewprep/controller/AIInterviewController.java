package com.interviewprep.controller;

import com.interviewprep.model.AIInterview;
import com.interviewprep.service.AIInterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai-interviews")
@RequiredArgsConstructor
public class AIInterviewController {

    private final AIInterviewService interviewService;

    @PostMapping("/start")
    public ResponseEntity<AIInterview> startInterview(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> request) {
        String role = request.getOrDefault("role", "Software Engineer");
        return ResponseEntity.ok(interviewService.startInterview(userDetails.getUsername(), role));
    }

    @PostMapping("/{id}/respond")
    public ResponseEntity<AIInterview> respondToInterview(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> request) {
        String message = request.get("message");
        if (message == null || message.trim().isEmpty()) {
            throw new IllegalArgumentException("Message content cannot be empty");
        }
        return ResponseEntity.ok(interviewService.respondToInterview(id, userDetails.getUsername(), message));
    }

    @GetMapping("/my")
    public ResponseEntity<List<AIInterview>> getMyInterviews(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(interviewService.getMyInterviews(userDetails.getUsername()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AIInterview> getInterviewById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(interviewService.getInterviewById(id, userDetails.getUsername()));
    }
}
