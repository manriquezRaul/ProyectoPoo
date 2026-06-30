package com.mentecolmena.backend.service;

import com.mentecolmena.backend.model.Nota;
import com.mentecolmena.backend.repository.NotaRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List; //Debido a que mongoRepository usa list, no arraylist

@Service
public class NotaService {
    private final NotaRepository notaRepository;

    public NotaService(NotaRepository notaRepository){
        this.notaRepository = notaRepository;
    }

    public List<Nota> obtenerTodas(){
        return notaRepository.findAll();
    }

    public Nota obtenerPorId(String id){
        return notaRepository.findById(id).orElse(null);

    }

    public Nota guardar(Nota nota) {
        if (nota.getSubject() == null || nota.getSubject().isBlank()) {
            nota.setSubject("General");
        }
        if (nota.getCreatedAt() == null) {
            nota.setCreatedAt(Instant.now());
        }
        return notaRepository.save(nota);
    }

    public boolean eliminarPorId(String id){
        boolean exito= false;
        if (notaRepository.existsById(id)){
            notaRepository.deleteById(id);
            exito= true;
        }
        return exito;
    }

    public java.util.Optional<Nota> obtenerPorId(String id) {
        return notaRepository.findById(id);
    }

    public boolean actualizarNota(String id, Nota nuevaNota){
        boolean exito= false;

        Nota nota = notaRepository.findById(id).orElse(null);
        if (nota!=null){
            nota.setTitulo(nuevaNota.getTitulo());
            nota.setContenido(nuevaNota.getContenido());
            if (nuevaNota.getSubject() != null && !nuevaNota.getSubject().isBlank()) {
                nota.setSubject(nuevaNota.getSubject());
            }
            nota.setPinned(nuevaNota.isPinned());

            notaRepository.save(nota);
            exito=true;
        }
        return exito;
    }
}