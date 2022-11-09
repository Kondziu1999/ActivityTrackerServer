package com.agh.activitytrackerserver.repository;

import com.agh.activitytrackerclient.models.ActivityUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActivityUserRepository extends JpaRepository<ActivityUser, String> {
}
