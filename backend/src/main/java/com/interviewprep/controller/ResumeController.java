package com.interviewprep.controller;

import com.interviewprep.model.Resume;
import com.interviewprep.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    @PostMapping("/upload")
    public ResponseEntity<Resume> upload(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(resumeService.uploadResume(userDetails.getUsername(), file));
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyResume(@AuthenticationPrincipal UserDetails userDetails) {
        return resumeService.getMyResume(userDetails.getUsername())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @GetMapping("/all")
    public ResponseEntity<List<Resume>> getAllResumes(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(resumeService.getAllResumes(userDetails.getUsername()));
    }

    @PostMapping("/analyze/{id}")
    public ResponseEntity<Resume> analyzeResume(@PathVariable Long id) {
        return ResponseEntity.ok(resumeService.analyzeResume(id));
    }
}
