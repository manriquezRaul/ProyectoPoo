package controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController


public class menuController {





    @GetMapping("/saludo")
    public String saludo(){
        return "Hola!";



    }



}
