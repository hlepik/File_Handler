package com.example.filehandler.model;
import lombok.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import javax.persistence.*;
import java.sql.Blob;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class File {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @NotNull
    private String name;
    @Lob
    @NotNull
    private Blob data;
}
