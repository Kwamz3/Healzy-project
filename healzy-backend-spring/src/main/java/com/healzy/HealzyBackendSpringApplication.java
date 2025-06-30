package com.healzy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(exclude = {
        org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration.class
})
public class HealzyBackendSpringApplication {

    public static void main(String[] args) {
        SpringApplication.run(HealzyBackendSpringApplication.class, args);
    }
}
