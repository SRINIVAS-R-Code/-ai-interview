package com.interviewprep.controller;

import com.interviewprep.dto.TestSubmissionDTO;
import com.interviewprep.model.*;
import com.interviewprep.service.MockTestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/tests")
@RequiredArgsConstructor
public class MockTestController {

    private final MockTestService mockTestService;

    @GetMapping
    public ResponseEntity<List<MockTest>> getAllTests() {
        return ResponseEntity.ok(mockTestService.getAllTests());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getTestWithQuestions(@PathVariable Long id) {
        return ResponseEntity.ok(mockTestService.getTestWithQuestions(id));
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<MockTestResult> submitTest(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody TestSubmissionDTO submission) {
        return ResponseEntity.ok(mockTestService.submitTest(id, userDetails.getUsername(), submission));
    }

    @GetMapping("/results/my")
    public ResponseEntity<List<MockTestResult>> getMyResults(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(mockTestService.getUserResults(userDetails.getUsername()));
    }

    @GetMapping("/results/{id}")
    public ResponseEntity<MockTestResult> getResultById(@PathVariable Long id) {
        return ResponseEntity.ok(mockTestService.getResultById(id));
    }
}
