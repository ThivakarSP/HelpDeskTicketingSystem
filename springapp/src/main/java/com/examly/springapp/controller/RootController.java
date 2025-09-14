package com.examly.springapp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RootController {

    // Redirect root URL to Swagger UI to avoid Whitelabel error page
    @GetMapping("/")
    public String index() {
        return "redirect:/swagger-ui/index.html"; // springdoc-ui default location
    }
}
