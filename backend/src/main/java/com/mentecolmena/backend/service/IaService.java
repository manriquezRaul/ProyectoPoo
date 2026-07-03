package com.mentecolmena.backend.service;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import com.mentecolmena.backend.ia.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class IaService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    @Value("${gemini.model:gemini-1.5-flash}")
    private String geminiModel;

    public IaService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    private String getApiKey() {
        if (geminiApiKey != null && !geminiApiKey.isBlank()) {
            return geminiApiKey;
        }
        String envKey = System.getenv("GEMINI_API_KEY");
        if (envKey != null && !envKey.isBlank()) {
            return envKey;
        }
        throw new IllegalStateException("Gemini API Key is not configured. Please define gemini.api.key in application.properties or set the GEMINI_API_KEY environment variable.");
    }

    public String generarContenidoEstudio(String notesContent, String tipoEstudio) {
        // Validate key presence before running
        getApiKey();

        GenerablePorIA generator;
        switch (tipoEstudio.toLowerCase()) {
            case "quiz":
                generator = new PromptQuiz();
                break;
            case "flashcard":
                generator = new PromptFlashcard();
                break;
            case "truefalse":
                generator = new PromptTrueFalse();
                break;
            case "deep":
                generator = new PromptDeepDevelopment();
                break;
            default:
                throw new IllegalArgumentException("Unknown study type: " + tipoEstudio);
        }

        String prompt = generator.construirPromptFinal(notesContent);

        return llamarGemini(prompt);
    }

    public String evaluarRespuestaAbierta(String question, String studentAnswer, String rubric) {
        // Validate key presence before running
        getApiKey();

        String prompt = "Actúa como un evaluador de desarrollo de software y teoría conceptual de ciencias de la computación. Evalúa la respuesta del estudiante a la siguiente pregunta.\n\n"
                + "Pregunta:\n" + question + "\n\n"
                + "Rúbrica de evaluación:\n" + rubric + "\n\n"
                + "Respuesta del estudiante:\n" + studentAnswer + "\n\n"
                + "Debes devolver la evaluación estrictamente como un objeto JSON con el siguiente esquema:\n"
                + "{\n"
                + "  \"score\": <puntuación del 0 al 100 como número entero>,\n"
                + "  \"feedback\": \"Comentarios constructivos y detallados\",\n"
                + "  \"improvements\": \"Aspectos específicos a mejorar\"\n"
                + "}\n"
                + "No incluyas explicaciones en texto plano fuera del JSON, solo el objeto JSON.";

        return llamarGemini(prompt);
    }

    private String llamarGemini(String prompt) {
        String apiKey = getApiKey();
        String url = "https://generativelanguage.googleapis.com/v1beta/models/" + geminiModel + ":generateContent?key=" + apiKey;

        try {
            // Prepare Request Payload
            Map<String, Object> parts = Map.of("text", prompt);
            Map<String, Object> content = Map.of("parts", List.of(parts));
            Map<String, Object> generationConfig = Map.of("responseMimeType", "application/json");
            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(content),
                    "generationConfig", generationConfig
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode rootNode = objectMapper.readTree(response.getBody());
                JsonNode textNode = rootNode.path("candidates").get(0).path("content").path("parts").get(0).path("text");
                return textNode.asText();
            } else {
                throw new RuntimeException("API response error: " + response.getStatusCode());
            }

        } catch (Exception e) {
            throw new RuntimeException("Error communicating with Gemini API: " + e.getMessage(), e);
        }
    }
}
