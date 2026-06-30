package com.interviewprep.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> home() {
        return ResponseEntity.ok(Map.of(
                "title", "InterviewAI API Server",
                "status", "UP",
                "message", "Welcome to the AI-Powered Interview Preparation Platform API server. Direct access to data endpoints requires JWT authentication.",
                "frontendUrl", "http://localhost:5173"
        ));
    }

    @GetMapping("/api")
    public ResponseEntity<Map<String, Object>> apiHome() {
        return ResponseEntity.ok(Map.of(
                "title", "InterviewAI API Endpoint Root",
                "status", "RUNNING",
                "endpoints", Map.of(
                        "auth", "/api/auth/*",
                        "tests", "/api/tests/*",
                        "coding", "/api/coding/*",
                        "aptitude", "/api/aptitude/*"
                )
        ));
    }
}
