package com.mentecolmena.backend.service;

import com.mentecolmena.backend.model.QuizResult;
import com.mentecolmena.backend.repository.QuizResultRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class QuizResultService {
    private final QuizResultRepository quizResultRepository;

    public QuizResultService(QuizResultRepository quizResultRepository) {
        this.quizResultRepository = quizResultRepository;
    }

    public List<QuizResult> getQuizzesSortedByCreatedAtDesc() {
        return quizResultRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    public List<QuizResult> findTop5ByOrderByCreatedAtDesc() {
        return quizResultRepository.findTop5ByOrderByCreatedAtDesc();
    }

    public QuizResult saveQuizResult(QuizResult quizResult) {
        if (quizResult.getCreatedAt() == null) {
            quizResult.setCreatedAt(Instant.now());
        }
        return quizResultRepository.save(quizResult);
    }

    public boolean deleteQuizResult(String id) {
        if (quizResultRepository.existsById(id)) {
            quizResultRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
