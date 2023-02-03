package com.example.filehandler;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.PropertySource;

@SpringBootApplication
@EntityScan("model")
public class FileHandlerApplication {

	public static void main(String[] args) {
		SpringApplication.run(FileHandlerApplication.class, args);
	}

}
