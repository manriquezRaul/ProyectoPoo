package com.mentecolmena.backend.model;

import java.util.ArrayList;
import java.util.List;

public class DashboardData {
    private long totalNotes;
    private int notesWeeklyDelta;
    private int totalSessionsStarted;
    private int activeDays;
    private int streakDays;
    private int bestStreak;
    private int accuracyValue;
    private String accuracyTrend;
    private int quizCount;
    private int weeklyCompletion;
    private List<DailyActivity> weeklyActivity = new ArrayList<>();
    private List<SubjectStat> subjects = new ArrayList<>();
    private List<QuizResult> recentQuizzes = new ArrayList<>();

    public DashboardData() {}

    public long getTotalNotes() {
        return totalNotes;
    }

    public void setTotalNotes(long totalNotes) {
        this.totalNotes = totalNotes;
    }

    public int getNotesWeeklyDelta() {
        return notesWeeklyDelta;
    }

    public void setNotesWeeklyDelta(int notesWeeklyDelta) {
        this.notesWeeklyDelta = notesWeeklyDelta;
    }

    public int getTotalSessionsStarted() {
        return totalSessionsStarted;
    }

    public void setTotalSessionsStarted(int totalSessionsStarted) {
        this.totalSessionsStarted = totalSessionsStarted;
    }

    public int getActiveDays() {
        return activeDays;
    }

    public void setActiveDays(int activeDays) {
        this.activeDays = activeDays;
    }

    public int getStreakDays() {
        return streakDays;
    }

    public void setStreakDays(int streakDays) {
        this.streakDays = streakDays;
    }

    public int getBestStreak() {
        return bestStreak;
    }

    public void setBestStreak(int bestStreak) {
        this.bestStreak = bestStreak;
    }

    public int getAccuracyValue() {
        return accuracyValue;
    }

    public void setAccuracyValue(int accuracyValue) {
        this.accuracyValue = accuracyValue;
    }

    public String getAccuracyTrend() {
        return accuracyTrend;
    }

    public void setAccuracyTrend(String accuracyTrend) {
        this.accuracyTrend = accuracyTrend;
    }

    public int getQuizCount() {
        return quizCount;
    }

    public void setQuizCount(int quizCount) {
        this.quizCount = quizCount;
    }

    public int getWeeklyCompletion() {
        return weeklyCompletion;
    }

    public void setWeeklyCompletion(int weeklyCompletion) {
        this.weeklyCompletion = weeklyCompletion;
    }

    public List<DailyActivity> getWeeklyActivity() {
        return weeklyActivity;
    }

    public void setWeeklyActivity(List<DailyActivity> weeklyActivity) {
        this.weeklyActivity = weeklyActivity;
    }

    public List<SubjectStat> getSubjects() {
        return subjects;
    }

    public void setSubjects(List<SubjectStat> subjects) {
        this.subjects = subjects;
    }

    public List<QuizResult> getRecentQuizzes() {
        return recentQuizzes;
    }

    public void setRecentQuizzes(List<QuizResult> recentQuizzes) {
        this.recentQuizzes = recentQuizzes;
    }

    public static class DailyActivity {
        private String day;
        private int notes;
        private int quizzes;

        public DailyActivity() {}

        public DailyActivity(String day, int notes, int quizzes) {
            this.day = day;
            this.notes = notes;
            this.quizzes = quizzes;
        }

        public String getDay() {
            return day;
        }

        public void setDay(String day) {
            this.day = day;
        }

        public int getNotes() {
            return notes;
        }

        public void setNotes(int notes) {
            this.notes = notes;
        }

        public int getQuizzes() {
            return quizzes;
        }

        public void setQuizzes(int quizzes) {
            this.quizzes = quizzes;
        }
    }

    public static class SubjectStat {
        private String subject;
        private int notes;
        private int progress;

        public SubjectStat() {}

        public SubjectStat(String subject, int notes, int progress) {
            this.subject = subject;
            this.notes = notes;
            this.progress = progress;
        }

        public String getSubject() {
            return subject;
        }

        public void setSubject(String subject) {
            this.subject = subject;
        }

        public int getNotes() {
            return notes;
        }

        public void setNotes(int notes) {
            this.notes = notes;
        }

        public int getProgress() {
            return progress;
        }

        public void setProgress(int progress) {
            this.progress = progress;
        }
    }
}
