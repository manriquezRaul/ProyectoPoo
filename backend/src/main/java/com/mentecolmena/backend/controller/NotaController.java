package com.mentecolmena.backend.controller;

import com.mentecolmena.backend.model.Nota;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
@RequestMapping("/api/notas")
public class NotaController {

    @GetMapping
    public ArrayList<Nota> obtenerNotas() {
        return new ArrayList<>();
    } //me devuelve un arraylist vacio

    @PostMapping
    public Nota crearNota(@RequestBody Nota nota){
        return nota;
    }
}
