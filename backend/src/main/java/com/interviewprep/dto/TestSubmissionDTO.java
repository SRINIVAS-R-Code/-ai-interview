package com.interviewprep.dto;

import lombok.Data;
import java.util.Map;

@Data
public class TestSubmissionDTO {
    private Map<String, String> answers; // questionId -> selectedOption
}
