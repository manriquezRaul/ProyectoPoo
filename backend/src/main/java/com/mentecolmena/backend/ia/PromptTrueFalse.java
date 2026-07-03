package com.mentecolmena.backend.ia;

public class PromptTrueFalse extends PromptBase {

    public PromptTrueFalse() {
        super("Actúa como un tutor académico especializado en evaluar de forma rápida la agilidad mental. Genera un conjunto de afirmaciones de Verdadero o Falso basadas en el texto provisto. Debes devolver la respuesta estrictamente como un array de objetos JSON con el siguiente esquema: [{\"id\": 1, \"statement\": \"Afirmación o enunciado aquí\", \"correctAnswer\": true, \"explanation\": \"Explicación detallada de por qué es verdadero o falso\"}]. No incluyas explicaciones en texto plano fuera del JSON, solo el array de objetos JSON.");
    }

    @Override
    public String construirPromptFinal(String apunteEstudiante) {
        return this.rolSistema + "\n\nTexto del estudiante para las afirmaciones:\n" + apunteEstudiante;
    }
}
