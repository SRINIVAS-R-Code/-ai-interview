package com.interviewprep.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewprep.exception.ResourceNotFoundException;
import com.interviewprep.model.*;
import com.interviewprep.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AptitudeService {

    private final AptitudeQuestionRepository questionRepository;
    private final AptitudeResultRepository resultRepository;
    private final UserRepository userRepository;
    private final LeaderboardService leaderboardService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<String> getTopics() {
        return List.of("QUANTITATIVE", "LOGICAL", "VERBAL", "VERBAL_REASONING", "NON_VERBAL_REASONING", "DATA_INTERPRETATION", "DATA_SUFFICIENCY");
    }

    public List<AptitudeQuestion> getQuestions(String topic, String difficulty) {
        String tUpper = topic.toUpperCase();
        int limit = 50;
        List<AptitudeQuestion> list;
        if (difficulty != null && !difficulty.trim().isEmpty()) {
            list = new ArrayList<>(questionRepository.findRandomByTopicAndDifficulty(tUpper, difficulty.toUpperCase(), limit));
            if (list.size() < limit) {
                List<AptitudeQuestion> fallback = questionRepository.findRandomByTopic(tUpper, limit);
                Set<Long> ids = new HashSet<>();
                for (AptitudeQuestion q : list) ids.add(q.getId());
                for (AptitudeQuestion q : fallback) {
                    if (!ids.contains(q.getId()) && list.size() < limit) {
                        list.add(q);
                        ids.add(q.getId());
                    }
                }
            }
        } else {
            list = questionRepository.findRandomByTopic(tUpper, limit);
        }
        return list;
    }

    public AptitudeResult submitAnswers(String topic, String userEmail, Map<String, String> answers) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        AptitudeQuestion.Topic topicEnum = AptitudeQuestion.Topic.valueOf(topic.toUpperCase());

        int score = 0;
        int total = 0;
        for (String qIdStr : answers.keySet()) {
            try {
                Long qId = Long.parseLong(qIdStr);
                AptitudeQuestion q = questionRepository.findById(qId).orElse(null);
                if (q != null && q.getTopic() == topicEnum) {
                    total++;
                    String submitted = answers.get(qIdStr);
                    if (q.getCorrectOption().equalsIgnoreCase(submitted)) {
                        score++;
                    }
                }
            } catch (Exception e) {
                // Ignore invalid key format
            }
        }
        if (total == 0) {
            List<AptitudeQuestion> questions = questionRepository.findByTopic(topicEnum);
            total = questions.size();
            for (AptitudeQuestion q : questions) {
                String submitted = answers.get(String.valueOf(q.getId()));
                if (q.getCorrectOption().equalsIgnoreCase(submitted)) score++;
            }
        }
        double percentage = total > 0 ? (double) score / total * 100 : 0;

        AptitudeResult result = AptitudeResult.builder()
                .user(user).topic(topicEnum)
                .score(score).total(total).percentage(percentage)
                .build();
        result = resultRepository.save(result);
        leaderboardService.updateLeaderboard(user, score, 0);
        return result;
    }

    public List<AptitudeResult> getUserResults(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return resultRepository.findByUserIdOrderByTakenAtDesc(user.getId());
    }
}
