package com.mentecolmena.backend.repository;

import com.mentecolmena.backend.model.QuizResult;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface QuizResultRepository extends MongoRepository<QuizResult, String> {
    List<QuizResult> findTop5ByOrderByCreatedAtDesc();
}
