package io.hubflow.core.web;

import io.hubflow.core.common.ApiResponse;
import io.hubflow.core.dto.AuthDtos;
import io.hubflow.core.security.CurrentUser;
import io.hubflow.core.service.AuthService;
import io.hubflow.core.service.OtpService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication", description = "Registration, login, token refresh and OTP verification")
public class AuthController {

    private final AuthService authService;
    private final OtpService otpService;

    public AuthController(AuthService authService, OtpService otpService) {
        this.authService = authService;
        this.otpService = otpService;
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new tenant and its owner account")
    public ResponseEntity<ApiResponse<AuthDtos.AuthTokens>> register(
            @Valid @RequestBody AuthDtos.RegisterRequest request, HttpServletRequest servletRequest) {

        AuthDtos.AuthTokens tokens = authService.register(request, servletRequest.getHeader("User-Agent"));
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(tokens));
    }

    @PostMapping("/login")
    @Operation(summary = "Exchange email and password for an access and refresh token pair")
    public ApiResponse<AuthDtos.AuthTokens> login(
            @Valid @RequestBody AuthDtos.LoginRequest request, HttpServletRequest servletRequest) {

        return ApiResponse.ok(authService.login(request, servletRequest.getHeader("User-Agent")));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Rotate a refresh token for a fresh access token")
    public ApiResponse<AuthDtos.AuthTokens> refresh(
            @Valid @RequestBody AuthDtos.RefreshRequest request, HttpServletRequest servletRequest) {

        return ApiResponse.ok(
                authService.refresh(request.refreshToken(), servletRequest.getHeader("User-Agent")));
    }

    @PostMapping("/logout")
    @Operation(summary = "Revoke every refresh token issued to the current user")
    public ApiResponse<String> logout() {
        authService.logout(CurrentUser.userId());
        return ApiResponse.ok("All sessions signed out");
    }

    @PostMapping("/otp/send")
    @Operation(summary = "Send a six digit OTP over WhatsApp")
    public ApiResponse<AuthDtos.OtpSendResponse> sendOtp(@Valid @RequestBody AuthDtos.OtpSendRequest request) {
        return ApiResponse.ok(otpService.send(request.phone(), request.purpose()));
    }

    @PostMapping("/otp/verify")
    @Operation(summary = "Verify an OTP and mark the phone number as confirmed")
    public ApiResponse<String> verifyOtp(@Valid @RequestBody AuthDtos.OtpVerifyRequest request) {
        authService.verifyPhone(request.phone(), request.code(), request.purpose());
        return ApiResponse.ok("Phone number verified");
    }

    @GetMapping("/me")
    @Operation(summary = "Return the profile attached to the current access token")
    public ApiResponse<AuthDtos.UserProfile> me() {
        return ApiResponse.ok(authService.profile(CurrentUser.userId()));
    }
}
