package com.examly.springapp.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

	// Adjust origins for security before deploying (e.g., https://yourdomain.com)
	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/api/**")
				.allowedOrigins("http://localhost:3000")
				.allowedMethods("GET","POST","PUT","PATCH","DELETE","OPTIONS")
				.allowedHeaders("*")
				.allowCredentials(true)
				.maxAge(3600);
	}
	// For SPA production hosting via Spring Boot: build React and place files in resources/static
	// Then ensure client-side routing fallback (e.g., via forwarding controller) if needed.
}
