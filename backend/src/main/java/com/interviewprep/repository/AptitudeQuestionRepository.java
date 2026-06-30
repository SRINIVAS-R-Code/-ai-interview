package com.interviewprep.repository;

import com.interviewprep.model.AptitudeQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface AptitudeQuestionRepository extends JpaRepository<AptitudeQuestion, Long> {
    @Query(value = "SELECT * FROM aptitude_questions WHERE topic = :topic AND difficulty = :difficulty ORDER BY RANDOM() LIMIT :lim", nativeQuery = true)
    List<AptitudeQuestion> findRandomByTopicAndDifficulty(String topic, String difficulty, int lim);

    @Query(value = "SELECT * FROM aptitude_questions WHERE topic = :topic ORDER BY RANDOM() LIMIT :lim", nativeQuery = true)
    List<AptitudeQuestion> findRandomByTopic(String topic, int lim);

    List<AptitudeQuestion> findByTopic(AptitudeQuestion.Topic topic);

    long countByTopicAndDifficulty(AptitudeQuestion.Topic topic, AptitudeQuestion.Difficulty difficulty);
}
