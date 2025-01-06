package com.linkedin.backend.features.authentication.controller;

import com.linkedin.backend.features.authentication.dto.AuthenticationRequestBody;
import com.linkedin.backend.features.authentication.dto.AuthenticationResponseBody;
import com.linkedin.backend.features.authentication.model.AuthenticationUser;
import com.linkedin.backend.features.authentication.service.AuthenticationService;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;

@RestController
@RequestMapping("/api/v1/authentication")
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @Autowired
    public AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @GetMapping("/user")
    public AuthenticationUser getUser(@RequestAttribute("authenticatedUser") AuthenticationUser authenticationUser) {
        return authenticationService.getUser(authenticationUser.getEmail());
    }

    @PostMapping("/login")
    public AuthenticationResponseBody loginPage(@Valid @RequestBody AuthenticationRequestBody loginRequestBody) {
        return authenticationService.login(loginRequestBody);
    }

    @PostMapping("/register")
    public AuthenticationResponseBody registerPage(@Valid @RequestBody AuthenticationRequestBody registerRequestBody) {
        try {
            return authenticationService.register(registerRequestBody);
        } catch (MessagingException | UnsupportedEncodingException e) {
            throw new RuntimeException("Registration failed", e);
        }
    }

    @PutMapping("/validate-email-verification-token")
    public ResponseEntity<String> verifyEmail(@RequestParam String token, @RequestAttribute("authenticatedUser") AuthenticationUser user) {
        authenticationService.validateEmailVerificationToken(token, user.getEmail());
        return ResponseEntity.ok("Email verified successfully.");
    }

    @GetMapping("/send-email-verification-token")
    public ResponseEntity<String> sendEmailVerificationToken(@RequestAttribute("authenticatedUser") AuthenticationUser user) {
        authenticationService.sendEmailVerificationToken(user.getEmail());
        return ResponseEntity.ok("Email verification token sent successfully.");
    }

    @PutMapping("/send-password-reset-token")
    public ResponseEntity<String> sendPasswordResetToken(@RequestParam String email) {
        authenticationService.sendPasswordResetToken(email);
        return ResponseEntity.ok("Password reset token sent successfully.");
    }

    @PutMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String newPassword, @RequestParam String token, @RequestParam String email) {
        authenticationService.resetPassword(email, newPassword, token);
        return ResponseEntity.ok("Password reset successfully.");
    }
}