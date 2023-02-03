package com.example.filehandler.controller;

import com.example.filehandler.auth.AuthenticationRequest;
import com.example.filehandler.auth.AuthenticationResponse;
import com.example.filehandler.service.AuthenticationService;
import com.example.filehandler.auth.RegisterRequest;
import com.example.filehandler.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin
public class AuthenticationController {

    private final AuthenticationService service;
    private final UserRepository repository;


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterRequest request){
        var userRegistered = repository.findByEmail(request.getEmail());
        if(userRegistered.isPresent()){
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("User already registered!");
        }
        return ResponseEntity.ok(service.register(request));
    }
    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody AuthenticationRequest request){
        return ResponseEntity.ok(service.authenticate(request));

    }
}
