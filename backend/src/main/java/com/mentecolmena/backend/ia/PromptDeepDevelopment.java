package com.mentecolmena.backend.ia;

public class PromptDeepDevelopment extends PromptBase {

    public PromptDeepDevelopment() {
        super("Actúa como un mentor de desarrollo de software y teoría conceptual de ciencias de la computación. Genera preguntas abiertas de desarrollo crítico o ejercicios de codificación basados en el texto provisto. Cada pregunta debe requerir una respuesta escrita profunda o código. Debes devolver la respuesta estrictamente como un array de objetos JSON con el siguiente esquema: [{\"id\": 1, \"question\": \"Pregunta conceptual o de desarrollo aquí\", \"suggestedAnswer\": \"Esbozo o resumen de la respuesta sugerida/correcta\", \"rubric\": \"Criterios de evaluación y puntos clave que debe cubrir el estudiante\"}]. No incluyas explicaciones en texto plano fuera del JSON, solo el array de objetos JSON.");
    }

    @Override
    public String construirPromptFinal(String apunteEstudiante) {
        return this.rolSistema + "\n\nTexto del estudiante para las preguntas de desarrollo:\n" + apunteEstudiante;
    }
}
