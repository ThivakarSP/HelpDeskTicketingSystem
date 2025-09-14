package com.examly.springapp.service;

import com.examly.springapp.model.KnowledgeBaseArticle;
import java.util.List;
import java.util.Optional;

public interface KnowledgeBaseArticleService {
    List<KnowledgeBaseArticle> getAllArticles();
    Optional<KnowledgeBaseArticle> getArticleById(Long id);
    KnowledgeBaseArticle createArticle(KnowledgeBaseArticle article);
    KnowledgeBaseArticle updateArticle(Long id, KnowledgeBaseArticle article);
    void deleteArticle(Long id);
    List<KnowledgeBaseArticle> getArticlesByCategoryId(Long categoryId);
    List<KnowledgeBaseArticle> searchArticlesByTitle(String title);
}