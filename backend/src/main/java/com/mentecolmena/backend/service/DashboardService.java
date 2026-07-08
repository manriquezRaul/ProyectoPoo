package com.mentecolmena.backend.service;

import com.mentecolmena.backend.model.DashboardData;
import com.mentecolmena.backend.model.Nota;
import com.mentecolmena.backend.model.QuizResult;
import com.mentecolmena.backend.model.SessionDay;
import com.mentecolmena.backend.repository.NotaRepository;
import com.mentecolmena.backend.repository.SessionDayRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class DashboardService {
    private final NotaRepository notaRepository;
    private final QuizResultService quizResultService;
    private final SessionDayRepository sessionDayRepository;

    public DashboardService(NotaRepository notaRepository, QuizResultService quizResultService,
            SessionDayRepository sessionDayRepository) {
        this.notaRepository = notaRepository;
        this.quizResultService = quizResultService;
        this.sessionDayRepository = sessionDayRepository;
    }

    public DashboardData getDashboard() {
        DashboardData data = new DashboardData();

        long totalNotes = notaRepository.count();
        data.setTotalNotes(totalNotes);
        data.setNotesWeeklyDelta(6);

        List<QuizResult> recentQuizzes = quizResultService.findTop5ByOrderByCreatedAtDesc();
        data.setRecentQuizzes(recentQuizzes);
        data.setQuizCount(recentQuizzes.size());
        data.setAccuracyValue(calculateAccuracy(recentQuizzes));
        data.setAccuracyTrend("+4.2%");
        data.setWeeklyCompletion(calculateWeeklyCompletion(recentQuizzes));

        List<SessionDay> days = sessionDayRepository.findAll();
        int activeDays = days.size();
        data.setActiveDays(activeDays);
        data.setStreakDays(calculateStreak(days));
        data.setBestStreak(Math.max(data.getStreakDays(), 12));
        data.setTotalSessionsStarted(days.stream().mapToInt(d -> d.getSessionsStarted()).sum());

        data.setWeeklyActivity(buildWeeklyActivity(days));
        data.setSubjects(buildStudySubjects());

        return data;
    }

    public SessionDay recordSessionDay(String date) {
        Optional<SessionDay> existing = sessionDayRepository.findByDate(date);
        SessionDay sessionDay = existing.orElseGet(SessionDay::new);
        sessionDay.setDate(date);
        sessionDay.setSessionsStarted(sessionDay.getSessionsStarted() + 1);
        if (sessionDay.getCreatedAt() == null) {
            sessionDay.setCreatedAt(Instant.now());
        }
        return sessionDayRepository.save(sessionDay);
    }

    public QuizResult saveQuizResult(QuizResult quizResult) {
        return quizResultService.saveQuizResult(quizResult);
    }

    private int calculateAccuracy(List<QuizResult> recentQuizzes) {
        if (recentQuizzes.isEmpty())
            return 0;
        return (int) recentQuizzes.stream().mapToInt(q -> q.getScore()).average().orElse(0);
    }

    private int calculateWeeklyCompletion(List<QuizResult> recentQuizzes) {
        if (recentQuizzes.isEmpty())
            return 0;
        long met = recentQuizzes.stream().filter(q -> q.isGoalMet()).count();
        return (int) ((met * 100.0) / recentQuizzes.size());
    }

    private int calculateStreak(List<SessionDay> days) {
        if (days.isEmpty())
            return 0;
        
        java.util.Set<LocalDate> activeDates = days.stream()
                .filter(d -> d.getSessionsStarted() > 0)
                .map(d -> {
                    try {
                        return LocalDate.parse(d.getDate());
                    } catch (Exception e) {
                        return null;
                    }
                })
                .filter(java.util.Objects::nonNull)
                .collect(java.util.stream.Collectors.toSet());
        
        if (activeDates.isEmpty()) {
            return 0;
        }

        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);
        
        // If today is not active and yesterday is not active, streak is 0
        if (!activeDates.contains(today) && !activeDates.contains(yesterday)) {
            return 0;
        }
        
        LocalDate current = activeDates.contains(today) ? today : yesterday;
        int streak = 0;
        while (activeDates.contains(current)) {
            streak++;
            current = current.minusDays(1);
        }
        return streak;
    }

    private List<DashboardData.DailyActivity> buildWeeklyActivity(List<SessionDay> days) {
        List<DashboardData.DailyActivity> result = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEE");
        LocalDate now = LocalDate.now();
        List<Nota> allNotes = notaRepository.findAll();
        for (int i = 6; i >= 0; i--) {
            LocalDate day = now.minusDays(i);
            String label = day.format(formatter);
            int notes = (int) allNotes.stream()
                    .filter(n -> n.getCreatedAt() != null
                            && n.getCreatedAt().atZone(java.time.ZoneId.systemDefault()).toLocalDate().equals(day))
                    .count();
            int quizzes = days.stream()
                    .filter(d -> {
                        try {
                            return LocalDate.parse(d.getDate()).equals(day);
                        } catch (Exception e) {
                            return false;
                        }
                    })
                    .mapToInt(d -> d.getSessionsStarted()).sum();
            result.add(new DashboardData.DailyActivity(label, notes, quizzes));
        }
        return result;
    }

    private List<DashboardData.SubjectStat> buildStudySubjects() {
        List<DashboardData.SubjectStat> subjects = new ArrayList<>();
        List<Nota> allNotes = notaRepository.findAll();
        List<QuizResult> allQuizzes = quizResultService.getQuizzesSortedByCreatedAtDesc();

        // 1. Object-Oriented Programming (OOP)
        long oopNotes = allNotes.stream()
                .filter(n -> n.getSubject() != null && ("oop".equalsIgnoreCase(n.getSubject().trim()) || "object-oriented programming".equalsIgnoreCase(n.getSubject().trim()) || "object-oriented\nprogramming".equalsIgnoreCase(n.getSubject().trim())))
                .count();
        double oopAvg = 0;
        if (oopNotes > 0) {
            oopAvg = allQuizzes.stream()
                    .filter(q -> q.getSubject() != null && (q.getSubject().toLowerCase().contains("oop") || q.getSubject().toLowerCase().contains("object-oriented")))
                    .mapToInt(q -> q.getScore())
                    .average()
                    .orElse(0);
        }

        // 2. Databases
        long dbNotes = allNotes.stream()
                .filter(n -> n.getSubject() != null && "databases".equalsIgnoreCase(n.getSubject().trim()))
                .count();
        double dbAvg = 0;
        if (dbNotes > 0) {
            dbAvg = allQuizzes.stream()
                    .filter(q -> q.getSubject() != null && q.getSubject().toLowerCase().contains("database"))
                    .mapToInt(q -> q.getScore())
                    .average()
                    .orElse(0);
        }

        // 3. Calculus
        long calcNotes = allNotes.stream()
                .filter(n -> n.getSubject() != null && "calculus".equalsIgnoreCase(n.getSubject().trim()))
                .count();
        double calcAvg = 0;
        if (calcNotes > 0) {
            calcAvg = allQuizzes.stream()
                    .filter(q -> q.getSubject() != null && q.getSubject().toLowerCase().contains("calculus"))
                    .mapToInt(q -> q.getScore())
                    .average()
                    .orElse(0);
        }

        // 4. Data Structures
        long dsNotes = allNotes.stream()
                .filter(n -> n.getSubject() != null && "data structures".equalsIgnoreCase(n.getSubject().trim()))
                .count();
        double dsAvg = 0;
        if (dsNotes > 0) {
            dsAvg = allQuizzes.stream()
                    .filter(q -> q.getSubject() != null && q.getSubject().toLowerCase().contains("data structure"))
                    .mapToInt(q -> q.getScore())
                    .average()
                    .orElse(0);
        }

        // 5. Linear Algebra
        long laNotes = allNotes.stream()
                .filter(n -> n.getSubject() != null && "linear algebra".equalsIgnoreCase(n.getSubject().trim()))
                .count();
        double laAvg = 0;
        if (laNotes > 0) {
            laAvg = allQuizzes.stream()
                    .filter(q -> q.getSubject() != null && q.getSubject().toLowerCase().contains("linear algebra"))
                    .mapToInt(q -> q.getScore())
                    .average()
                    .orElse(0);
        }

        // 6. Discrete Math
        long dmNotes = allNotes.stream()
                .filter(n -> n.getSubject() != null && "discrete math".equalsIgnoreCase(n.getSubject().trim()))
                .count();
        double dmAvg = 0;
        if (dmNotes > 0) {
            dmAvg = allQuizzes.stream()
                    .filter(q -> q.getSubject() != null && q.getSubject().toLowerCase().contains("discrete math"))
                    .mapToInt(q -> q.getScore())
                    .average()
                    .orElse(0);
        }

        subjects.add(new DashboardData.SubjectStat("Object-Oriented\nProgramming", (int) oopNotes, (int) Math.round(oopAvg)));
        subjects.add(new DashboardData.SubjectStat("Databases", (int) dbNotes, (int) Math.round(dbAvg)));
        subjects.add(new DashboardData.SubjectStat("Calculus", (int) calcNotes, (int) Math.round(calcAvg)));
        subjects.add(new DashboardData.SubjectStat("Data Structures", (int) dsNotes, (int) Math.round(dsAvg)));
        subjects.add(new DashboardData.SubjectStat("Linear Algebra", (int) laNotes, (int) Math.round(laAvg)));
        subjects.add(new DashboardData.SubjectStat("Discrete Math", (int) dmNotes, (int) Math.round(dmAvg)));
        return subjects;
    }
}
