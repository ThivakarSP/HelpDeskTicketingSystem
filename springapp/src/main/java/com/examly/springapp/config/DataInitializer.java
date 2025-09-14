package com.examly.springapp.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.examly.springapp.model.Category;
import com.examly.springapp.model.Priority;
import com.examly.springapp.repository.CategoryRepository;
import com.examly.springapp.repository.PriorityRepository;

import java.util.Arrays;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner seedReferenceData(CategoryRepository categoryRepository,
                                        PriorityRepository priorityRepository) {
        return args -> {
            if (priorityRepository.count() == 0) {
                List<String> priorities = Arrays.asList("LOW", "MEDIUM", "HIGH");
                for (String p : priorities) {
                    Priority priority = new Priority();
                    priority.setName(p);
                    priority.setDescription(p + " priority");
                    priorityRepository.save(priority);
                }
            }

            if (categoryRepository.count() == 0) {
                List<String> categories = Arrays.asList("SOFTWARE", "HARDWARE", "NETWORK", "OTHER");
                for (String c : categories) {
                    Category category = new Category();
                    category.setName(c);
                    category.setDescription(c + " related issues");
                    categoryRepository.save(category);
                }
            }
        };
    }
}
