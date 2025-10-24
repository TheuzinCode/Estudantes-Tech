package com.estudantestech.store.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.http.HttpMethod;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/login",
                                "/entrar",
                                "/perfil",
                                "/css/**",
                                "/js/**",
                                "/criarConta",
                                "/img/**",
                                "/images/**",
                                "/loja",
                                "/loja/**"
                        ).permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/clients").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/clients/login").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/clients/**").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/clients/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/clients/**").permitAll()
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        .loginPage("/login")               // GET para minha login.html
                        .loginProcessingUrl("/process-login") // POST: quem processa é o Security
                        .usernameParameter("email")
                        .passwordParameter("password")
                        .defaultSuccessUrl("/dashboard", true)
                        .permitAll()
                )
                .logout(logout -> logout.permitAll());

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
