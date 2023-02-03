package com.example.filehandler.service;

import com.example.filehandler.model.File;
import com.example.filehandler.repository.FileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
@RequiredArgsConstructor
public class FileService {
   private final FileRepository repository;

   public Iterable<File> getAll(){
      List<File> result = new ArrayList<>();
      var allFiles = repository.findAll();
      for (var item : allFiles) {
         result.add(new File(item.getName(), item.getId()));
      }
      return result;

   }
   public File save(MultipartFile file) throws IOException {
      String fileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));

      File FileDB = new File(fileName, file.getContentType(), file.getBytes());

      return repository.save(FileDB);
   }

   public Optional<File> getFile(UUID id){
      return repository.findById(id);

   }





}
