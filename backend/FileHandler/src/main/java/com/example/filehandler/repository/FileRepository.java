package com.example.filehandler.repository;

import com.example.filehandler.model.File;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface FileRepository extends CrudRepository<File, UUID> {


}
