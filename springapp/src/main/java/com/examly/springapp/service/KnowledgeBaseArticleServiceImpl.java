package com.examly.springapp.service;

import com.examly.springapp.model.KnowledgeBaseArticle;
import com.examly.springapp.repository.KnowledgeBaseArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class KnowledgeBaseArticleServiceImpl implements KnowledgeBaseArticleService {
    
    @Autowired
    private KnowledgeBaseArticleRepository kbArticleRepository;
    
    @Override
    public List<KnowledgeBaseArticle> getAllArticles() {
        return kbArticleRepository.findAll();
    }
    
    @Override
    public Optional<KnowledgeBaseArticle> getArticleById(Long id) {
        return kbArticleRepository.findById(id);
    }
    
    @Override
    public KnowledgeBaseArticle createArticle(KnowledgeBaseArticle article) {
        return kbArticleRepository.save(article);
    }
    
    @Override
    public KnowledgeBaseArticle updateArticle(Long id, KnowledgeBaseArticle article) {
        if (kbArticleRepository.existsById(id)) {
            article.setId(id);
            return kbArticleRepository.save(article);
        }
        throw new RuntimeException("Knowledge Base Article not found with id: " + id);
    }
    
    @Override
    public void deleteArticle(Long id) {
        kbArticleRepository.deleteById(id);
    }
    
    @Override
    public List<KnowledgeBaseArticle> getArticlesByCategoryId(Long categoryId) {
        return kbArticleRepository.findByCategoryId(categoryId);
    }
    
    @Override
    public List<KnowledgeBaseArticle> searchArticlesByTitle(String title) {
        return kbArticleRepository.findByTitleContainingIgnoreCase(title);
    }
}