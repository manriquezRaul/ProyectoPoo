package com.mentecolmena.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Document(collection = "notas")
public class Nota {
    @Id
    private String id;
    private String titulo;
    private String contenido;
    private String subject;
    private Instant createdAt;
    private boolean pinned;

    public Nota(){ //vacio, para darle forma despue
    }

    public String getId() {return id;}
    public void setId(String id) {this.id = id;}

    public String getTitulo() {return titulo;}
    public void setTitulo(String titulo) {this.titulo = titulo;}

    public String getContenido() {return contenido;}
    public void setContenido(String contenido) {this.contenido = contenido;}

    public String getSubject() {return subject;}
    public void setSubject(String subject) {this.subject = subject;}

    public Instant getCreatedAt() {return createdAt;}
    public void setCreatedAt(Instant createdAt) {this.createdAt = createdAt;}

    public boolean isPinned() {return pinned;}
    public void setPinned(boolean pinned) {this.pinned = pinned;}
}
