package com.examly.springapp.service;

import com.examly.springapp.model.Attachment;
import com.examly.springapp.dto.CreateAttachmentRequest;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface AttachmentService {
    List<Attachment> getAllAttachments();
    Attachment uploadAttachment(Long ticketId, Long userId, MultipartFile file);
    List<Attachment> getAttachmentsByTicketId(Long ticketId);
    Attachment getAttachmentById(Long id);
    Attachment createAttachment(CreateAttachmentRequest request);
    Attachment updateAttachment(Long id, CreateAttachmentRequest request);
    void deleteAttachment(Long id);
}