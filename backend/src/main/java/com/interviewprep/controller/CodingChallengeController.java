package com.interviewprep.controller;

import com.interviewprep.dto.CodingSubmissionDTO;
import com.interviewprep.model.*;
import com.interviewprep.service.CodingChallengeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coding")
@RequiredArgsConstructor
public class CodingChallengeController {

    private final CodingChallengeService codingService;

    @GetMapping
    public ResponseEntity<List<CodingChallenge>> getChallenges(
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String topic) {
        return ResponseEntity.ok(codingService.getChallenges(difficulty, topic));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CodingChallenge> getChallenge(@PathVariable Long id) {
        return ResponseEntity.ok(codingService.getChallenge(id));
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<CodingSubmission> submitCode(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody CodingSubmissionDTO dto) {
        return ResponseEntity.ok(codingService.submitCode(id, userDetails.getUsername(), dto));
    }

    @PostMapping("/{id}/run")
    public ResponseEntity<java.util.Map<String, String>> runCode(
            @PathVariable Long id,
            @RequestBody java.util.Map<String, String> request) {
        String code = request.get("code");
        String language = request.get("language");
        String customInput = request.get("customInput");
        String output = codingService.runCode(id, code, language, customInput);
        return ResponseEntity.ok(java.util.Map.of("output", output));
    }

    @GetMapping("/submissions/my")
    public ResponseEntity<List<CodingSubmission>> getMySubmissions(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(codingService.getUserSubmissions(userDetails.getUsername()));
    }
}
