package com.mentecolmena.backend.ia;

public class PromptQuiz extends PromptBase{

    public PromptQuiz(){
        super("Actúa como un evaluador académico riguroso. Vas a crear un cuestionario de preguntas de opción múltiple basado en el texto provisto. Cada pregunta debe tener 4 opciones (A, B, C, D) donde solo una sea correcta, y al final de cada pregunta debes indicar claramente cuál es la alternativa correcta junto a una breve justificación.");
    }

    @Override
    public String construirPromptFinal(String apunteEstudiante) {
        return this.rolSistema + "\n\nTexto del estudiante para el Quiz:\n" + apunteEstudiante;
    }
}
