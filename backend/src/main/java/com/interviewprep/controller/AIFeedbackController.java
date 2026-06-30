package com.interviewprep.controller;

import com.interviewprep.dto.FeedbackRequestDTO;
import com.interviewprep.model.AIFeedback;
import com.interviewprep.service.AIFeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
public class AIFeedbackController {

    private final AIFeedbackService feedbackService;

    @PostMapping("/generate")
    public ResponseEntity<AIFeedback> generateFeedback(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody FeedbackRequestDTO dto) {
        return ResponseEntity.ok(feedbackService.generateFeedback(userDetails.getUsername(), dto));
    }

    @GetMapping("/my")
    public ResponseEntity<List<AIFeedback>> getMyFeedback(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(feedbackService.getUserFeedback(userDetails.getUsername()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AIFeedback> getFeedback(@PathVariable Long id) {
        return ResponseEntity.ok(feedbackService.getFeedbackById(id));
    }

    @PostMapping("/hint")
    public ResponseEntity<java.util.Map<String, String>> getHint(@RequestBody java.util.Map<String, String> requestData) {
        String hint = feedbackService.generateHint(requestData);
        return ResponseEntity.ok(java.util.Map.of("hint", hint));
    }

    @PostMapping("/solution")
    public ResponseEntity<java.util.Map<String, String>> getSolution(@RequestBody java.util.Map<String, String> requestData) {
        String title = requestData.get("title");
        String description = requestData.get("description");
        String language = requestData.get("language");
        String solution = feedbackService.generateIdealSolution(title, description, language);
        return ResponseEntity.ok(java.util.Map.of("solution", solution));
    }
}
