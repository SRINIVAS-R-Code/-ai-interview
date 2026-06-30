package com.interviewprep.repository;

import com.interviewprep.model.MockTest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MockTestRepository extends JpaRepository<MockTest, Long> {
    List<MockTest> findBySubject(String subject);
    List<MockTest> findByDifficulty(MockTest.Difficulty difficulty);
}
