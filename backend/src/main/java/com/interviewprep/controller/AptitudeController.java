package com.interviewprep.controller;

import com.interviewprep.model.*;
import com.interviewprep.service.AptitudeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/aptitude")
@RequiredArgsConstructor
public class AptitudeController {

    private final AptitudeService aptitudeService;

    @GetMapping("/topics")
    public ResponseEntity<List<String>> getTopics() {
        return ResponseEntity.ok(aptitudeService.getTopics());
    }

    @GetMapping("/{topic}")
    public ResponseEntity<List<AptitudeQuestion>> getQuestions(
            @PathVariable String topic,
            @RequestParam(required = false) String difficulty) {
        return ResponseEntity.ok(aptitudeService.getQuestions(topic, difficulty));
    }

    @PostMapping("/{topic}/submit")
    public ResponseEntity<AptitudeResult> submitAnswers(
            @PathVariable String topic,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> answers) {
        return ResponseEntity.ok(aptitudeService.submitAnswers(topic, userDetails.getUsername(), answers));
    }

    @GetMapping("/results/my")
    public ResponseEntity<List<AptitudeResult>> getMyResults(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(aptitudeService.getUserResults(userDetails.getUsername()));
    }
}
