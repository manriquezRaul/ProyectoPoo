package com.mentecolmena.backend.ia;

public class PromptQuiz extends PromptBase {

    public PromptQuiz() {
        super("Actúa como un evaluador académico riguroso. Vas a crear un cuestionario de preguntas de opción múltiple basado en el texto provisto. Cada pregunta debe tener exactamente 4 opciones (A, B, C, D) con una sola opción correcta, y una explicación de por qué es correcta. Debes devolver la respuesta estrictamente como un array de objetos JSON con el siguiente esquema: [{\"id\": 1, \"question\": \"Texto de la pregunta aquí\", \"options\": [{\"label\": \"A\", \"text\": \"Opción A\"}, {\"label\": \"B\", \"text\": \"Opción B\"}, {\"label\": \"C\", \"text\": \"Opción C\"}, {\"label\": \"D\", \"text\": \"Opción D\"}], \"correct\": \"A\", \"explanation\": \"Explicación detallada\"}]. No incluyas explicaciones en texto plano fuera del JSON, solo el array de objetos JSON.");
    }

    @Override
    public String construirPromptFinal(String apunteEstudiante) {
        return this.rolSistema + "\n\nTexto del estudiante para el Quiz:\n" + apunteEstudiante;
    }
}
