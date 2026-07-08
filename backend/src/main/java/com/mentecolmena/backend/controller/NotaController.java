package com.mentecolmena.backend.controller;

import java.util.List;

import com.mentecolmena.backend.model.Nota;
import com.mentecolmena.backend.service.NotaService;
import com.mentecolmena.backend.service.FileParserService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/notas")
public class NotaController {

    private final NotaService notaService;
    private final FileParserService fileParserService;

    public NotaController(NotaService notaService, FileParserService fileParserService) {
        this.notaService = notaService;
        this.fileParserService = fileParserService;
    }

    @GetMapping
    public List<Nota> obtenerNotas() {
        return notaService.obtenerTodas();
    }

    @PostMapping
    public Nota crearNota(@RequestBody Nota nota){
        return notaService.guardar(nota);
    }

    @DeleteMapping("/{id}")
    public boolean eliminarNota(@PathVariable String id){
        return notaService.eliminarPorId(id);
    }

    @GetMapping("/{id}")
    public Nota obtenerNota(@PathVariable String id){
        return notaService.obtenerPorId(id).orElse(null);
    }

    @PutMapping("/{id}")
    public boolean actualizarNota(@PathVariable String id, @RequestBody Nota nota){
        return notaService.actualizarNota(id,nota);
    }

    @PostMapping("/import")
    public ResponseEntity<?> importarArchivo(@RequestParam("file") MultipartFile file) {
        try {
            String originalFilename = file.getOriginalFilename();
            String contenidoExtraido = fileParserService.extractText(file);
            
            Nota nuevaNota = new Nota();
            nuevaNota.setTitulo(originalFilename != null ? originalFilename : "Nota Importada");
            nuevaNota.setContenido(contenidoExtraido);
            nuevaNota.setSubject("General");
            
            Nota notaGuardada = notaService.guardar(nuevaNota);
            return ResponseEntity.ok(notaGuardada);
        } catch (IllegalArgumentException | UnsupportedOperationException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al procesar el archivo: " + e.getMessage());
        }
    }
}
