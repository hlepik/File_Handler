package com.example.filehandler.controller;

import com.example.filehandler.model.File;
import com.example.filehandler.repository.FileRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/")
public class FileController {

    private final FileRepository repository;

    public FileController(FileRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public File findAll(){
        return repository.findAll();
    }
}

