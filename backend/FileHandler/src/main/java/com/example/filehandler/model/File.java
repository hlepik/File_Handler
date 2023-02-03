package com.example.filehandler.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class File {

    @Id
    @GeneratedValue
    private UUID id;

    @NotNull
    private String name;
    @NotNull
    private String type;

    @Lob
    @NotNull
    private byte[] data;
    public File(String name, String type, byte[] data) {
        this.name = name;
        this.type = type;
        this.data = data;
    }
    public File(String name, UUID id) {
        this.name = name;
        this.id = id;
    }
}
