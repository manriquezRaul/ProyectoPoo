package com.mentecolmena.backend.controller;

import com.mentecolmena.backend.model.QuizResult;
import com.mentecolmena.backend.repository.QuizResultRepository;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/quizzes")
public class QuizResultController {
    private final QuizResultRepository quizResultRepository;

    public QuizResultController(QuizResultRepository quizResultRepository) {
        this.quizResultRepository = quizResultRepository;
    }

    @GetMapping
    public List<QuizResult> getQuizzes() {
        return quizResultRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    @PostMapping
    public QuizResult saveQuiz(@RequestBody QuizResult quizResult) {
        if (quizResult.getCreatedAt() == null) {
            quizResult.setCreatedAt(Instant.now());
        }
        return quizResultRepository.save(quizResult);
    }

    @DeleteMapping("/{id}")
    public boolean deleteQuiz(@PathVariable String id) {
        if (quizResultRepository.existsById(id)) {
            quizResultRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
