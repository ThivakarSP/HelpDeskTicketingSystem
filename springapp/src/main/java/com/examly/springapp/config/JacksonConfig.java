package com.examly.springapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.fasterxml.jackson.datatype.hibernate5.Hibernate5Module;

@Configuration
public class JacksonConfig {
    @Bean
    public Hibernate5Module hibernate5Module() {
        Hibernate5Module module = new Hibernate5Module();
        // Do not force lazy loading; serialize initialized properties only
        module.disable(Hibernate5Module.Feature.FORCE_LAZY_LOADING);
        return module;
    }
}
