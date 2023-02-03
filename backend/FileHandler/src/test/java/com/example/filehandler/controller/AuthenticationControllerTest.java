package com.example.filehandler.controller;

import com.example.filehandler.config.ApplicationConfig;
import com.example.filehandler.config.JwtAuthenticatedFilter;
import com.example.filehandler.config.JwtService;
import com.example.filehandler.config.SecurityConfiguration;
import com.example.filehandler.model.Role;
import com.example.filehandler.model.User;
import com.example.filehandler.repository.UserRepository;
import com.example.filehandler.service.AuthenticationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ContextConfiguration(classes = {JwtAuthenticatedFilter.class, JwtService.class, SecurityConfiguration.class, ApplicationConfig.class, AuthenticationProvider.class})
@WebMvcTest(AuthenticationController.class)
@RunWith(SpringRunner.class)
@Import(AuthenticationController.class)
class AuthenticationControllerTest {
    @MockBean
    AuthenticationService authService;
    @MockBean
    UserRepository repository;

    @Autowired
    private MockMvc  mockMvc;

    @Autowired
    private ObjectMapper objectMapper;


    @Test
    @WithMockUser(username = "test@test.com",  roles = "USER")
    void register() throws Exception {
        User user = new User("firstname","lastname", "test@test.com", "password", Role.USER);

        mockMvc.perform(post("/api/v1/auth/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .characterEncoding("utf-8")
                        .content(objectMapper.writeValueAsString(user))
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

    }

    @Test
    @WithMockUser(username = "test@test.com",  roles = "USER")
    void login() throws Exception {
        User user = new User("firstname","lastname", "test@test.com", "password", Role.USER);

        mockMvc.perform(post("/api/v1/auth/login").with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .characterEncoding("utf-8")
                        .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isOk());
    }
}

