package com.example.filehandler.controller;

import com.example.filehandler.config.JwtAuthenticatedFilter;
import com.example.filehandler.config.JwtService;
import com.example.filehandler.model.File;
import com.example.filehandler.repository.UserRepository;
import com.example.filehandler.service.FileService;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@RunWith(SpringRunner.class)
@WebMvcTest(FileController.class)
@ContextConfiguration(classes = {JwtAuthenticatedFilter.class, JwtService.class})
class FileControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private JwtService jwt;
    @MockBean
    private UserRepository repository;

    @MockBean
    private FileService service;

    @Test
    @WithMockUser(username = "test@test.com",  roles = "USER")
    void findAllWithMockUserCustomAuthorities() throws Exception {

        this.mockMvc.perform(get("/files")
                .contentType("application/json")
                .header("Authorization", "Bearer " + jwt.generateToken(getUser("test@test.com", "password", "ROLE_USER")))
                .with(csrf()))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "test@test.com",  roles = "USER")
    void uploadNewFileWhenAuthenticated() throws Exception {
        byte[] bytes = new byte[1024 * 10];
        MockMultipartFile file = new MockMultipartFile("test.pdf", "", "application/pdf", bytes);
        this.mockMvc.perform(post("/files")
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                        .content(String.valueOf(file))
                        .header("Authorization", "Bearer " + jwt.generateToken(getUser( "test@test.com", "password", "ROLE_USER")))
                        .with(csrf()))
                .andExpect(status().isOk());
    }
    @Test
    void uploadNewFileWhenUnauthenticated() throws Exception {
        byte[] bytes = new byte[1024 * 10];
        MockMultipartFile file = new MockMultipartFile("test.pdf", "", "application/pdf", bytes);
        this.mockMvc.perform(post("/files")
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                        .content(String.valueOf(file))
                        .with(csrf()))
                .andExpect(status().isUnauthorized());

    }

    @Test
    @WithMockUser(username = "test@test.com",  roles = "USER")
    void getFileByIdWhenAuthenticated() throws Exception {
        byte[] bytes = new byte[123];
        UUID uuid = UUID.randomUUID();
        File dbFile = new File(
                uuid,
                "test.pdf",
                "application/pdf",
                bytes
                );
        when(service.getFile(any())).thenReturn(Optional.of(dbFile));

        this.mockMvc.perform(get("/files/" + uuid )
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                        .header("Authorization", "Bearer " + jwt.generateToken(getUser( "test@test.com", "password", "ROLE_USER")))
                        .with(csrf()))
                .andExpect(status().isOk());

    }
    @Test
    void getFileByIdWhenUnauthenticated() throws Exception {
        byte[] bytes = new byte[123];
        UUID uuid = UUID.randomUUID();
        File dbFile = new File(
                uuid,
                "test.pdf",
                "application/pdf",
                bytes
        );
        when(service.getFile(any())).thenReturn(Optional.of(dbFile));

        this.mockMvc.perform(get("/files/" + uuid )
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                        .with(csrf()))
                .andExpect(status().isUnauthorized());

    }

    @Test
    @WithMockUser(username = "test@test.com",  roles = "USER")
    void deleteFileWhenAuthenticated() throws Exception {
        byte[] bytes = new byte[123];
        UUID uuid = UUID.randomUUID();
        File dbFile = new File(
                uuid,
                "test.pdf",
                "application/pdf",
                bytes
        );
        when(service.getFile(any())).thenReturn(Optional.of(dbFile));

        this.mockMvc.perform(delete("/files/" + uuid )
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                        .header("Authorization", "Bearer " + jwt.generateToken(getUser( "test@test.com", "password", "ROLE_USER")))
                        .with(csrf()))
                .andExpect(status().isOk());
    }
    @Test
    void deleteFileWhenUnauthenticated() throws Exception {
        byte[] bytes = new byte[123];
        UUID uuid = UUID.randomUUID();
        File dbFile = new File(
                uuid,
                "test.pdf",
                "application/pdf",
                bytes
        );
        when(service.getFile(any())).thenReturn(Optional.of(dbFile));

        this.mockMvc.perform(delete("/files/" + uuid )
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                        .with(csrf()))
                .andExpect(status().isUnauthorized());
    }
    private UserDetails getUser(String username, String password, String role){
        List<GrantedAuthority> grantedAuthorityList = new ArrayList<>();
        grantedAuthorityList.add(new SimpleGrantedAuthority(role));
        return new User(username, password, grantedAuthorityList);
    }

}