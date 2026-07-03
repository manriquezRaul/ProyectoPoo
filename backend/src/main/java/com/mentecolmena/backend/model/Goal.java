package com.mentecolmena.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "goals")
public class Goal {
    @Id
    private String id;
    private String label;
    private int manualDone;
    private int goal;
    private String color;
    private boolean isCustom;

    public Goal() {
    }

    public Goal(String label, int manualDone, int goal, String color, boolean isCustom) {
        this.label = label;
        this.manualDone = manualDone;
        this.goal = goal;
        this.color = color;
        this.isCustom = isCustom;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public int getManualDone() {
        return manualDone;
    }

    public void setManualDone(int manualDone) {
        this.manualDone = manualDone;
    }

    public int getGoal() {
        return goal;
    }

    public void setGoal(int goal) {
        this.goal = goal;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public boolean isCustom() {
        return isCustom;
    }

    public void setCustom(boolean custom) {
        isCustom = custom;
    }
}
