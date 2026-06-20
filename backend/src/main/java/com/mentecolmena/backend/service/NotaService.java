package com.mentecolmena.backend.service;

import com.mentecolmena.backend.model.Nota;
import com.mentecolmena.backend.repository.NotaRepository;
import org.springframework.stereotype.Service;

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

    public Nota guardar(Nota nota) {
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

    public boolean actualizarNota(String id, Nota nuevaNota){
        boolean exito= false;

        Nota nota = notaRepository.findById(id).orElse(null);
        if (nota!=null){
            nota.setTitulo(nuevaNota.getTitulo());
            nota.setContenido(nuevaNota.getContenido());

            notaRepository.save(nota);
            exito=true;
        }
        return exito;
    }
}