package com.examly.springapp.controller;

import com.examly.springapp.dto.CreateKnowledgeBaseArticleRequest;
import com.examly.springapp.model.Category;
import com.examly.springapp.model.KnowledgeBaseArticle;
import com.examly.springapp.service.CategoryService;
import com.examly.springapp.service.KnowledgeBaseArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/knowledge-base")
public class KnowledgeBaseController {
    
    @Autowired
    private KnowledgeBaseArticleService kbArticleService;
    
    @Autowired
    private CategoryService categoryService;
    
    @GetMapping
    public ResponseEntity<List<KnowledgeBaseArticle>> getAllArticles() {
        List<KnowledgeBaseArticle> articles = kbArticleService.getAllArticles();
        return ResponseEntity.ok(articles);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<KnowledgeBaseArticle> getArticleById(@PathVariable Long id) {
        Optional<KnowledgeBaseArticle> article = kbArticleService.getArticleById(id);
        return article.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<KnowledgeBaseArticle>> getArticlesByCategory(@PathVariable Long categoryId) {
        List<KnowledgeBaseArticle> articles = kbArticleService.getArticlesByCategoryId(categoryId);
        return ResponseEntity.ok(articles);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<KnowledgeBaseArticle>> searchArticles(@RequestParam String title) {
        List<KnowledgeBaseArticle> articles = kbArticleService.searchArticlesByTitle(title);
        return ResponseEntity.ok(articles);
    }
    
    @PostMapping
    public ResponseEntity<KnowledgeBaseArticle> createArticle(@RequestBody CreateKnowledgeBaseArticleRequest request) {
        try {
            KnowledgeBaseArticle article = new KnowledgeBaseArticle();
            article.setTitle(request.getTitle());
            article.setContent(request.getContent());
            
            if (request.getCategoryId() != null) {
                Optional<Category> category = categoryService.getCategoryById(request.getCategoryId());
                if (category.isPresent()) {
                    article.setCategory(category.get());
                } else {
                    return ResponseEntity.badRequest().build();
                }
            }
            
            KnowledgeBaseArticle createdArticle = kbArticleService.createArticle(article);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdArticle);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<KnowledgeBaseArticle> updateArticle(@PathVariable Long id, 
                                                            @RequestBody CreateKnowledgeBaseArticleRequest request) {
        try {
            KnowledgeBaseArticle article = new KnowledgeBaseArticle();
            article.setTitle(request.getTitle());
            article.setContent(request.getContent());
            
            if (request.getCategoryId() != null) {
                Optional<Category> category = categoryService.getCategoryById(request.getCategoryId());
                if (category.isPresent()) {
                    article.setCategory(category.get());
                } else {
                    return ResponseEntity.badRequest().build();
                }
            }
            
            KnowledgeBaseArticle updatedArticle = kbArticleService.updateArticle(id, article);
            return ResponseEntity.ok(updatedArticle);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArticle(@PathVariable Long id) {
        try {
            kbArticleService.deleteArticle(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}