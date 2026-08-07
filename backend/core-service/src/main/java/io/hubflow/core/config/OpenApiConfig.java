package io.hubflow.core.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    private static final String SECURITY_SCHEME = "bearerAuth";

    @Bean
    public OpenAPI hubflowOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("Hubflow Core Service API")
                        .version("1.0.0")
                        .description("""
                                Authentication, CRM, campaign, billing, HRMS and reporting APIs for the
                                Hubflow Automation platform. All endpoints except registration, login,
                                OTP, the public plan catalogue and WhatsApp webhooks require a bearer
                                access token issued by this service.
                                """)
                        .contact(new Contact().name("Hubflow Engineering").email("engineering@hubflow.io"))
                        .license(new License().name("Proprietary")))
                .servers(List.of(
                        new Server().url("http://localhost:8081").description("Local core service"),
                        new Server().url("http://localhost:8080/api").description("Through the API gateway")))
                .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME))
                .components(new Components().addSecuritySchemes(SECURITY_SCHEME,
                        new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Access token returned by /api/v1/auth/login")));
    }
}
