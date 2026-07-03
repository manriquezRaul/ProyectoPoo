package com.mentecolmena.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "sessionDays")
public class SessionDay {
    @Id
    private String id;
    private String date;
    private int sessionsStarted;
    private Instant createdAt;

    public SessionDay() {}

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public int getSessionsStarted() {
        return sessionsStarted;
    }

    public void setSessionsStarted(int sessionsStarted) {
        this.sessionsStarted = sessionsStarted;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
