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

    @Value("${gemini.model:gemini-2.5-flash}")
    private String geminiModel;

    public IaService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    private String loadApiKeyFromDotEnv() {
        java.io.File[] files = {
            new java.io.File(".env"),
            new java.io.File("../.env"),
            new java.io.File("backend/.env")
        };
        for (java.io.File envFile : files) {
            if (envFile.exists()) {
                try (java.io.BufferedReader reader = new java.io.BufferedReader(new java.io.FileReader(envFile))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        line = line.trim();
                        if (line.startsWith("#") || line.isBlank()) {
                            continue;
                        }
                        int eqIdx = line.indexOf('=');
                        if (eqIdx > 0) {
                            String key = line.substring(0, eqIdx).trim();
                            String value = line.substring(eqIdx + 1).trim();
                            if (value.startsWith("\"") && value.endsWith("\"")) {
                                value = value.substring(1, value.length() - 1);
                            } else if (value.startsWith("'") && value.endsWith("'")) {
                                value = value.substring(1, value.length() - 1);
                            }
                            if ("GEMINI_API_KEY".equals(key)) {
                                return value;
                            }
                        }
                    }
                } catch (Exception e) {
                    // Ignore and try next
                }
            }
        }
        return null;
    }

    private String getApiKey(String clientApiKey) {
        if (clientApiKey != null && !clientApiKey.isBlank()) {
            return clientApiKey;
        }
        String envKey = System.getenv("GEMINI_API_KEY");
        if (envKey != null && !envKey.isBlank()) {
            return envKey;
        }
        String dotEnvKey = loadApiKeyFromDotEnv();
        if (dotEnvKey != null && !dotEnvKey.isBlank()) {
            return dotEnvKey;
        }
        if (geminiApiKey != null && !geminiApiKey.isBlank()) {
            return geminiApiKey;
        }
        throw new IllegalStateException("Gemini API Key is not configured. Please define gemini.api.key in application.properties, set the GEMINI_API_KEY environment variable, or configure it in the web Settings page.");
    }

    public String generarContenidoEstudio(String notesContent, String tipoEstudio, String clientApiKey) {
        // Validate key presence before running
        getApiKey(clientApiKey);

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

        return llamarGemini(prompt, clientApiKey);
    }

    public String evaluarRespuestaAbierta(String question, String studentAnswer, String rubric, String clientApiKey) {
        // Validate key presence before running
        getApiKey(clientApiKey);

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

        return llamarGemini(prompt, clientApiKey);
    }

    private String llamarGemini(String prompt, String clientApiKey) {
        return llamarGemini(prompt, true, clientApiKey);
    }

    private String llamarGemini(String prompt, boolean forceJson, String clientApiKey) {
        String apiKey = getApiKey(clientApiKey);
        String url = "https://generativelanguage.googleapis.com/v1beta/models/" + geminiModel + ":generateContent?key=" + apiKey;

        try {
            // Prepare Request Payload
            Map<String, Object> parts = Map.of("text", prompt);
            Map<String, Object> content = Map.of("parts", List.of(parts));
            
            Map<String, Object> requestBody;
            if (forceJson) {
                Map<String, Object> generationConfig = Map.of("responseMimeType", "application/json");
                requestBody = Map.of(
                        "contents", List.of(content),
                        "generationConfig", generationConfig
                );
            } else {
                requestBody = Map.of(
                        "contents", List.of(content)
                );
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode rootNode = objectMapper.readTree(response.getBody());
                JsonNode textNode = rootNode.path("candidates").get(0).path("content").path("parts").get(0).path("text");
                return textNode.asString() != null ? textNode.asString() : "";
            } else {
                throw new RuntimeException("API response error: " + response.getStatusCode());
            }

        } catch (Exception e) {
            throw new RuntimeException("Error communicating with Gemini API: " + e.getMessage(), e);
        }
    }

    public String chatearConNota(String chatMessage, String noteContent, String clientApiKey) {
        getApiKey(clientApiKey);
        String prompt = "Eres MenteColmena AI, un asistente de estudio inteligente e interactivo. "
                + "Responde a la consulta del estudiante de manera clara, concisa y amigable. "
                + "Si la consulta tiene relación con el apunte provisto, utilízalo para responder de manera contextualizada.\n\n"
                + "Contenido del apunte del estudiante:\n"
                + "-----\n"
                + (noteContent != null ? noteContent : "No hay contenido en este apunte.") + "\n"
                + "-----\n\n"
                + "Consulta del estudiante: " + chatMessage;

        return llamarGemini(prompt, false, clientApiKey);
    }
}
