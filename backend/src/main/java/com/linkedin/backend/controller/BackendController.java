package com.linkedin.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.Map;

@ControllerAdvice
@RestController
@RequestMapping("api/vi")
public class BackendController {

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String,String>> handleHttpMessageNotReadableException(HttpMessageNotReadableException e){
        return ResponseEntity
                .badRequest()
                .body(Map.of("Message","Required request body is missing."));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String,String>> handleMethodArgumentNotValidException(MethodArgumentNotValidException e){
        StringBuilder errorMessage = new StringBuilder();
        e.getBindingResult().getFieldErrors().forEach( error ->
                errorMessage
                        .append(error.getField())
                        .append(": ")
                        .append(error.getDefaultMessage())
                        .append("; ")
        );
        return ResponseEntity
                .badRequest()
                .body(Map.of("Message",errorMessage.toString()));
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<Map<String, String>> handleNoResourceFoundException(NoResourceFoundException e){
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of("Message", e.getMessage()));
    }

    @ExceptionHandler({IllegalArgumentException.class, IllegalStateException.class})
    public ResponseEntity<Map<String,String>> handleIllegalArgumentException(IllegalArgumentException e){
        return ResponseEntity
                .badRequest()
                .body(Map.of("Message",e.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleException(Exception e){
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("Message", e.getMessage()));
    }
}
