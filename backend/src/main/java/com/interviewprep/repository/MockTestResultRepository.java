package com.interviewprep.repository;

import com.interviewprep.model.MockTestResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.OptionalDouble;

public interface MockTestResultRepository extends JpaRepository<MockTestResult, Long> {
    List<MockTestResult> findByUserIdOrderBySubmittedAtDesc(Long userId);
    List<MockTestResult> findByUserIdOrderBySubmittedAtAsc(Long userId);
    long countByUserId(Long userId);

    @Query("SELECT AVG(r.percentage) FROM MockTestResult r WHERE r.user.id = :userId")
    Double findAvgPercentageByUserId(Long userId);
}
