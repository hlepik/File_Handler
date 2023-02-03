package com.example.filehandler.model;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user", uniqueConstraints = @UniqueConstraint(columnNames = "Email"))
public class User {

    @Id
    @Column
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @NotNull

    @Column
    private String firstName;
    @NotNull

    @Column
    private String lastName;

    @NotNull

    @Column
    private String email;
    @NotNull

    private String password;

}
