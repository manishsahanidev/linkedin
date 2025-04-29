package com.linkedin.backend.features.authentication.controller;

import com.linkedin.backend.features.authentication.dto.AuthenticationRequestBody;
import com.linkedin.backend.features.authentication.dto.AuthenticationResponseBody;
import com.linkedin.backend.features.authentication.model.AuthenticationUser;
import com.linkedin.backend.features.authentication.service.AuthenticationService;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;

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

    @DeleteMapping("/delete")
    public ResponseEntity<Map<String, String>> deleteUser(
            @RequestAttribute("authenticatedUser") AuthenticationUser user) {
        authenticationService.deleteUser(user.getId());
        Map<String, String> response = new HashMap<>();
        response.put("message", "User deleted successfully.");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/validate-email-verification-token")
    public ResponseEntity<Map<String, String>> verifyEmail(@RequestParam String token,
            @RequestAttribute("authenticatedUser") AuthenticationUser user) {
        authenticationService.validateEmailVerificationToken(token, user.getEmail());
        Map<String, String> response = new HashMap<>();
        response.put("message", "Email verified successfully.");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/send-email-verification-token")
    public ResponseEntity<Map<String, String>> sendEmailVerificationToken(
            @RequestAttribute("authenticatedUser") AuthenticationUser user) {
        authenticationService.sendEmailVerificationToken(user.getEmail());
        Map<String, String> response = new HashMap<>();
        response.put("message", "Email verification token sent successfully.");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/send-password-reset-token")
    public ResponseEntity<Map<String, String>> sendPasswordResetToken(@RequestParam String email) {
        authenticationService.sendPasswordResetToken(email);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Password reset token sent successfully.");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestParam String newPassword,
            @RequestParam String token,
            @RequestParam String email) {
        authenticationService.resetPassword(email, newPassword, token);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Password reset successfully.");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile/{id}")
    public AuthenticationUser updateUserProfile(
            @RequestAttribute("authenticatedUser") AuthenticationUser user,
            @PathVariable Long id,
            @RequestParam(required = false) String firstName,
            @RequestParam(required = false) String lastName,
            @RequestParam(required = false) String company,
            @RequestParam(required = false) String position,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String profilePicture,
            @RequestParam(required = false) String coverPicture,
            @RequestParam(required = false) String about) {

        // check if the user has permission to update the profile
        if (!user.getId().equals(id)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "User does not have permission to update this profile.");
        }

        return authenticationService.updateUserProfile(id, firstName, lastName, company, position, location,
                profilePicture, coverPicture, about);
    }
}