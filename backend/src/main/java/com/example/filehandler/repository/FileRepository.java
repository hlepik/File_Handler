package com.example.filehandler.repository;

import com.example.filehandler.model.File;
import org.springframework.stereotype.Component;

@Component
public class FileRepository {

    public File findAll(){

       var a = new File();
       a.setId(323232323L);
       a.setName("re");


        return a;
    }
}
