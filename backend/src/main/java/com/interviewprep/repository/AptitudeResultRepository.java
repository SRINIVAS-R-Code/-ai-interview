package com.interviewprep.repository;

import com.interviewprep.model.AptitudeResult;
import com.interviewprep.model.AptitudeQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface AptitudeResultRepository extends JpaRepository<AptitudeResult, Long> {
    List<AptitudeResult> findByUserIdOrderByTakenAtDesc(Long userId);

    @Query("SELECT AVG(r.percentage) FROM AptitudeResult r WHERE r.user.id = :userId AND r.topic = :topic")
    Double findAvgPercentageByUserIdAndTopic(Long userId, AptitudeQuestion.Topic topic);
}
