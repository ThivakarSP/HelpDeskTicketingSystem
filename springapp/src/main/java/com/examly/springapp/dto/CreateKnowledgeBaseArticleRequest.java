package com.examly.springapp.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateKnowledgeBaseArticleRequest {
    private String title;
    private String content;
    private Long categoryId;
}