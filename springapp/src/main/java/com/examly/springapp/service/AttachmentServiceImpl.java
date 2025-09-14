package com.examly.springapp.service;

import com.examly.springapp.model.Attachment;
import com.examly.springapp.dto.CreateAttachmentRequest;
import com.examly.springapp.repository.AttachmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class AttachmentServiceImpl implements AttachmentService {

    private final AttachmentRepository attachmentRepository;

    public AttachmentServiceImpl(AttachmentRepository attachmentRepository) {
        this.attachmentRepository = attachmentRepository;
    }

    @Override
    public Attachment uploadAttachment(Long ticketId, Long userId, MultipartFile file) {
        try {
            Attachment attachment = new Attachment();
            attachment.setFileName(file.getOriginalFilename());
            attachment.setFileUrl("/uploads/" + file.getOriginalFilename()); // Simple file URL
            // Note: The Attachment model uses Ticket object, not IDs
            // uploadedAt removed as per new schema
            
            return attachmentRepository.save(attachment);
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload attachment: " + e.getMessage());
        }
    }

    @Override
    public List<Attachment> getAttachmentsByTicketId(Long ticketId) {
        return attachmentRepository.findByTicketId(ticketId);
    }

    @Override
    public Attachment getAttachmentById(Long id) {
        return attachmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attachment not found with ID: " + id));
    }

    @Override
    public List<Attachment> getAllAttachments() {
        return attachmentRepository.findAll();
    }

    @Override
    public Attachment createAttachment(CreateAttachmentRequest request) {
        Attachment attachment = new Attachment();
        attachment.setFileName(request.getFileName());
        attachment.setFileUrl(request.getFileUrl());
        // uploadedAt removed as per new schema
        return attachmentRepository.save(attachment);
    }

    @Override
    public Attachment updateAttachment(Long id, CreateAttachmentRequest request) {
        Attachment attachment = getAttachmentById(id);
        attachment.setFileName(request.getFileName());
        attachment.setFileUrl(request.getFileUrl());
        return attachmentRepository.save(attachment);
    }

    @Override
    public void deleteAttachment(Long id) {
        Attachment attachment = getAttachmentById(id);
        attachmentRepository.delete(attachment);
    }
}