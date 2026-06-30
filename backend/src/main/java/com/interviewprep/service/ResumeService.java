package com.interviewprep.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.interviewprep.exception.ResourceNotFoundException;
import com.interviewprep.model.*;
import com.interviewprep.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final AIFeedbackService aiService;
    private final Cloudinary cloudinary;

    public Resume uploadResume(String userEmail, MultipartFile file) throws IOException {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String fileUrl = null;
        String publicId = null;

        // Try Cloudinary if configured and not default placeholder
        boolean cloudinaryConfigured = cloudinary != null && 
                cloudinary.config != null &&
                cloudinary.config.cloudName != null &&
                !"your_cloud_name".equals(cloudinary.config.cloudName);

        if (cloudinaryConfigured) {
            try {
                Map uploadResult = cloudinary.uploader().upload(
                        file.getBytes(),
                        ObjectUtils.asMap(
                                "resource_type", "raw",
                                "folder", "interview-prep/resumes",
                                "public_id", "resume_" + user.getId() + "_" + System.currentTimeMillis()
                        )
                );
                fileUrl = (String) uploadResult.get("secure_url");
                publicId = (String) uploadResult.get("public_id");
            } catch (Exception e) {
                // Fail-silent, will fallback to local storage below
            }
        }

        if (fileUrl == null) {
            // Local storage fallback
            String filename = "resume_" + user.getId() + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename().replaceAll("[^a-zA-Z0-9\\.\\-_]", "_");
            java.io.File uploadsDir = new java.io.File("uploads");
            if (!uploadsDir.exists()) {
                uploadsDir.mkdirs();
            }
            java.io.File dest = new java.io.File(uploadsDir.getAbsoluteFile(), filename);
            java.nio.file.Files.write(dest.toPath(), file.getBytes());
            fileUrl = "/uploads/" + filename;
            publicId = "local_" + filename;
        }

        Resume resume = Resume.builder()
                .user(user)
                .fileUrl(fileUrl)
                .cloudinaryPublicId(publicId)
                .build();
        return resumeRepository.save(resume);
    }

    public Optional<Resume> getMyResume(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return resumeRepository.findTopByUserIdOrderByUploadedAtDesc(user.getId());
    }

    public Resume analyzeResume(Long resumeId) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found: " + resumeId));

        String prompt = String.format("""
            You are a career coach and resume expert. The candidate has uploaded a resume stored at: %s
            
            Please provide a professional resume analysis with:
            1. Top 3 strengths of this candidate profile
            2. Top 3 areas for improvement
            3. ATS (Applicant Tracking System) compatibility score out of 10
            4. Suggested skills to add for software engineering roles
            5. One-sentence overall verdict
            
            Note: Since we cannot read the actual PDF here, provide general best-practice advice for a software engineering resume with emphasis on:
            - Clean formatting, measurable achievements, relevant tech stack
            """,
            resume.getFileUrl());

        String feedback = aiService.callGeminiRaw(prompt);
        resume.setAiFeedback(feedback);
        return resumeRepository.save(resume);
    }

    public List<Resume> getAllResumes(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return resumeRepository.findByUserIdOrderByUploadedAtDesc(user.getId());
    }
}
