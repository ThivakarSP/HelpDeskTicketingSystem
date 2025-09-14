package com.examly.springapp.repository;

import com.examly.springapp.model.KnowledgeBaseArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface KnowledgeBaseArticleRepository extends JpaRepository<KnowledgeBaseArticle, Long> {
    List<KnowledgeBaseArticle> findByCategoryId(Long categoryId);
    List<KnowledgeBaseArticle> findByTitleContainingIgnoreCase(String title);
}
