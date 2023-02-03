package com.example.filehandler.controller;
import com.example.filehandler.model.File;
import com.example.filehandler.repository.FileRepository;
import com.example.filehandler.service.FileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.Objects;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class FileController {


    private final FileService service;
    private final FileRepository repository;

    @RequestMapping(value = "/")
    public String index() {
        return "index";
    }
    @GetMapping( "/files")
    public Iterable<File> findAll(){

        return service.getAll();
    }

    @PostMapping(value="/files", consumes = { "multipart/form-data" })
    public ResponseEntity<?> uploadNewFile(@NonNull @Valid @RequestParam("data") MultipartFile multipartFile) throws  IOException {
        if(multipartFile.getSize() > 5000000){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File size exceeds the allowed size!");
        }
        else if(!isSupportedContentType(Objects.requireNonNull(multipartFile.getContentType()))){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File type not allowed!");
        }
        try {
            service.save(multipartFile);
            return ResponseEntity.status(HttpStatus.OK).body("");

        }catch(IOException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Something went wrong!");
        }
    }
    @PreAuthorize("hasAnyAuthority('USER','ADMIN')")

    @GetMapping("/files/{id}")
    public ResponseEntity<?> getFile(@PathVariable UUID id) {
        var file = service.getFile(id);

        if(file.isPresent()){
            return ResponseEntity.ok()
                    .body(file.get().getData());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("File not found!");

    }
    @PreAuthorize("hasAnyAuthority('USER','ADMIN')")

    @DeleteMapping("/files/{id}")
    public ResponseEntity<String> deleteFile(@PathVariable UUID id) {

        try {
            repository.deleteById(id);
            return ResponseEntity.status(HttpStatus.OK).body("");

        }catch(RuntimeException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("File not found!");

        }
    }
    private boolean isSupportedContentType(String contentType) {
        return contentType.equals("text/plain")
                || contentType.equals("application/pdf")
                || contentType.equals("image/gif")
                || contentType.equals("image/svg+xml")
                || contentType.equals("image/png")
                || contentType.equals("image/jpg")
                || contentType.equals("image/jpeg")
                || contentType.equals("application/msword")
                || contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document")
                || contentType.equals("application/vnd.etsi.asic-e+zip")
                || contentType.equals("application/vnd.ms-excel")
                || contentType.equals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    }

}
