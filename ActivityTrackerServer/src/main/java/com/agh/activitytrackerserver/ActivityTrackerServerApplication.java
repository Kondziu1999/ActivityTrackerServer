package com.agh.activitytrackerserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories
@EntityScan(basePackages = "com.agh.*")
public class ActivityTrackerServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ActivityTrackerServerApplication.class, args);
    }

}
