package com.interviewprep.repository;

import com.interviewprep.model.CodingChallenge;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CodingChallengeRepository extends JpaRepository<CodingChallenge, Long> {
    List<CodingChallenge> findByDifficulty(CodingChallenge.Difficulty difficulty);
    List<CodingChallenge> findByTopic(String topic);
    List<CodingChallenge> findByDifficultyAndTopic(CodingChallenge.Difficulty difficulty, String topic);
}
