package com.mentecolmena.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "quizResults")
public class QuizResult {
    @Id
    private String id;
    private String subject;
    private int score;
    private String date;
    private String status;
    private String badge;
    private boolean goalMet;
    private Instant createdAt;

    public QuizResult() {}

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getBadge() {
        return badge;
    }

    public void setBadge(String badge) {
        this.badge = badge;
    }

    public boolean isGoalMet() {
        return goalMet;
    }

    public void setGoalMet(boolean goalMet) {
        this.goalMet = goalMet;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    private java.util.List<java.util.Map<String, Object>> questions;

    public java.util.List<java.util.Map<String, Object>> getQuestions() {
        return questions;
    }

    public void setQuestions(java.util.List<java.util.Map<String, Object>> questions) {
        this.questions = questions;
    }
}
