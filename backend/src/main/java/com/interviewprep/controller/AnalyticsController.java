package com.interviewprep.controller;

import com.interviewprep.dto.AnalyticsSummaryDTO;
import com.interviewprep.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/summary")
    public ResponseEntity<AnalyticsSummaryDTO> getSummary(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(analyticsService.getSummary(userDetails.getUsername()));
    }

    @GetMapping("/progress")
    public ResponseEntity<List<Map<String, Object>>> getProgress(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(analyticsService.getProgressData(userDetails.getUsername()));
    }

    @GetMapping("/subjects")
    public ResponseEntity<Map<String, Double>> getSubjectBreakdown(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(analyticsService.getSubjectBreakdown(userDetails.getUsername()));
    }
}
