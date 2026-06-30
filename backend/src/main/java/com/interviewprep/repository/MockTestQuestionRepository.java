package com.interviewprep.repository;

import com.interviewprep.model.MockTestQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface MockTestQuestionRepository extends JpaRepository<MockTestQuestion, Long> {
    List<MockTestQuestion> findByTestId(Long testId);

    @Query(value = "SELECT * FROM mock_test_questions WHERE test_id = :testId ORDER BY id LIMIT 50", nativeQuery = true)
    List<MockTestQuestion> findTop50ByTestId(@Param("testId") Long testId);
}
