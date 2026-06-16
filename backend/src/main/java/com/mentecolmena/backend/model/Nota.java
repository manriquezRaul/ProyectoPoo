package model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
@Document(collection = "notas")
public class Nota {
    @Id
    private String id;
    private String titulo;
    private String contenido;

    public Nota(){ //vacio, para darle forma despue
    }

    public String getId() {return id;}
    public void setId(String id) {this.id = id;}

    public String getTitulo() {return titulo;}
    public void setTitulo(String titulo) {this.titulo = titulo;}

    public String getContenido() {return contenido;}
    public void setContenido(String contenido) {this.contenido = contenido;}
}
