package com.mentecolmena.backend.controller;

import com.mentecolmena.backend.model.Cuaderno;
import com.mentecolmena.backend.model.Nota;
import com.mentecolmena.backend.repository.CuadernoRepository;
import com.mentecolmena.backend.repository.NotaRepository;
import com.mentecolmena.backend.service.IaService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/ia")
public class IaController {

    private final IaService iaService;
    private final CuadernoRepository cuadernoRepository;
    private final NotaRepository notaRepository;

    public IaController(IaService iaService, CuadernoRepository cuadernoRepository, NotaRepository notaRepository) {
        this.iaService = iaService;
        this.cuadernoRepository = cuadernoRepository;
        this.notaRepository = notaRepository;
    }

    @PostMapping("/generar")
    public ResponseEntity<String> generarContenidoEstudio(
            @RequestBody Map<String, Object> payload,
            @RequestHeader(value = "X-Gemini-API-Key", required = false) String clientApiKey) {
        String notebookId = (String) payload.get("notebookId");
        String tipoEstudio = (String) payload.get("tipoEstudio");
        String dificultad = (String) payload.get("dificultad");
        int cantidadPreguntas = payload.containsKey("cantidadPreguntas") ? ((Number) payload.get("cantidadPreguntas")).intValue() : 5;
        String scope = (String) payload.get("scope");
        
        List<String> customNoteIds = (List<String>) payload.get("noteIds");
        List<String> customNotebookIds = (List<String>) payload.get("notebookIds");

        List<Nota> notasAProcesar = new ArrayList<>();

        if (customNoteIds != null && !customNoteIds.isEmpty()) {
            Iterable<Nota> notesIterable = notaRepository.findAllById(customNoteIds);
            notesIterable.forEach(notasAProcesar::add);
        }

        if (customNotebookIds != null && !customNotebookIds.isEmpty()) {
            for (String nbId : customNotebookIds) {
                Optional<Cuaderno> cuadernoOpt = cuadernoRepository.findById(nbId);
                if (cuadernoOpt.isPresent()) {
                    List<String> noteIds = cuadernoOpt.get().getNoteIds();
                    if (noteIds != null && !noteIds.isEmpty()) {
                        Iterable<Nota> notesIterable = notaRepository.findAllById(noteIds);
                        notesIterable.forEach(notasAProcesar::add);
                    }
                }
            }
        }

        if (notasAProcesar.isEmpty() && notebookId != null && !notebookId.isBlank()) {
            Optional<Cuaderno> cuadernoOpt = cuadernoRepository.findById(notebookId);
            if (cuadernoOpt.isPresent()) {
                List<String> noteIds = cuadernoOpt.get().getNoteIds();
                if (noteIds != null && !noteIds.isEmpty()) {
                    Iterable<Nota> notesIterable = notaRepository.findAllById(noteIds);
                    notesIterable.forEach(notasAProcesar::add);
                }
            }
        }

        // Fallback to all notes if no specific notebook is selected or notebook has no notes
        if (notasAProcesar.isEmpty()) {
            notasAProcesar = notaRepository.findAll();
        }

        // Filter based on scope
        if ("Pinned notes only".equalsIgnoreCase(scope)) {
            notasAProcesar = notasAProcesar.stream()
                    .filter(Nota::isPinned)
                    .collect(Collectors.toList());
        }

        if (notasAProcesar.isEmpty()) {
            return ResponseEntity.badRequest().body("{\"error\": \"No hay apuntes disponibles para generar el estudio en base al alcance seleccionado.\"}");
        }

        // Concatenate text content
        StringBuilder notesTextBuilder = new StringBuilder();
        for (Nota nota : notasAProcesar) {
            notesTextBuilder.append("Nota: ").append(nota.getTitulo()).append("\n");
            notesTextBuilder.append("Contenido:\n").append(nota.getContenido()).append("\n\n");
        }

        // Append constraints for count and difficulty
        notesTextBuilder.append("\nEspecificaciones adicionales para la generación:\n");
        notesTextBuilder.append("- Dificultad académica: ").append(dificultad != null ? dificultad : "Medium").append("\n");
        notesTextBuilder.append("- Cantidad de elementos requeridos: ").append(cantidadPreguntas).append(". Genera exactamente esta cantidad de elementos.");

        try {
            String jsonResult = iaService.generarContenidoEstudio(notesTextBuilder.toString(), tipoEstudio, clientApiKey);
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(jsonResult);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @PostMapping("/evaluar")
    public ResponseEntity<String> evaluarRespuesta(
            @RequestBody Map<String, String> payload,
            @RequestHeader(value = "X-Gemini-API-Key", required = false) String clientApiKey) {
        String question = payload.get("question");
        String studentAnswer = payload.get("studentAnswer");
        String rubric = payload.get("rubric");

        if (question == null || studentAnswer == null) {
            return ResponseEntity.badRequest().body("{\"error\": \"Faltan parámetros requeridos para la evaluación.\"}");
        }

        try {
            String evaluationJson = iaService.evaluarRespuestaAbierta(question, studentAnswer, rubric != null ? rubric : "", clientApiKey);
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(evaluationJson);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chatearConNota(
            @RequestBody Map<String, String> payload,
            @RequestHeader(value = "X-Gemini-API-Key", required = false) String clientApiKey) {
        String message = payload.get("message");
        String noteContent = payload.get("noteContent");

        if (message == null || message.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "El mensaje no puede estar vacío"));
        }

        try {
            String aiResponse = iaService.chatearConNota(message, noteContent, clientApiKey);
            return ResponseEntity.ok(Map.of("response", aiResponse));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}
