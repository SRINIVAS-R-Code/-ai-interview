package com.interviewprep.service;

import com.interviewprep.exception.ResourceNotFoundException;
import com.interviewprep.model.User;
import com.interviewprep.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final AptitudeResultRepository aptitudeRepository;
    private final MockTestResultRepository mockRepository;
    private final CodingSubmissionRepository codingRepository;
    private final AIFeedbackService aiService;

    public String getCoachRecommendations(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        long totalAptitude = 0;
        long totalMock = 0;
        long totalCoding = 0;

        try {
            totalAptitude = aptitudeRepository.findByUserIdOrderByTakenAtDesc(user.getId()).size();
            totalMock = mockRepository.findByUserIdOrderBySubmittedAtDesc(user.getId()).size();
            totalCoding = codingRepository.findByUserIdOrderBySubmittedAtDesc(user.getId()).size();
        } catch (Exception e) {
            // fallback
        }

        // Call Gemini to generate a personalized career coaching plan
        String prompt = String.format("""
            You are a premium career coach and interview preparation mentor. The candidate has the following platform statistics:
            - Aptitude tests completed: %d
            - Full Mock interviews/tests completed: %d
            - Coding challenges submitted: %d
            
            Evaluate this candidate's preparation state and return a JSON structured object with suggestions.
            Format the response strictly as a JSON object with the following keys (do not wrap in markdown code blocks like ```json, return raw JSON):
            {
              "verdict": "A personalized motivational career advice or assessment of their prep status (1-2 sentences)",
              "quote": "A powerful motivational quote to inspire them today",
              "dailyGoals": [
                 "Daily Goal 1: specific topic or skill to practice today based on their stats",
                 "Daily Goal 2: specific topic or skill to practice today",
                 "Daily Goal 3: specific topic or skill to practice today"
              ],
              "nextSteps": [
                 "A strategic action step (e.g. Try an Easy coding challenge or Easy Quantitative Aptitude)",
                 "A strategic action step (e.g. Upload your resume for review or practice mock interviews)"
              ]
            }
            """, totalAptitude, totalMock, totalCoding);

        return aiService.callGeminiRaw(prompt);
    }
}
