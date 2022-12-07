package com.agh.activitytrackerserver.repository;


import com.agh.activitytrackerclient.models.UserLog;
import com.agh.activitytrackerclient.models.UserWithLogsCount;
import com.agh.activitytrackerserver.transport.EndpointHitCount;
import com.agh.activitytrackerserver.transport.EndpointHitCountQuery;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface UserLogRepository extends JpaRepository<UserLog, Integer>, CustomUserLogRepository {

//    @Query("SELECT new com.agh.activitytrackerclient.models.UserWithLogsCount(log.activityUserId, count (log.activityUserId)) from UserLog as log where log.activityUserId is not null GROUP BY log.activityUserId ORDER BY count (log.activityUserId) ")
//    List<UserWithLogsCount> getUserIdsWithMostActivity(Pageable pageable);

//    @Query("SELECT count* from UserLog

    List<UserLog> findAllByActivityUserId(String userId, Pageable pageable);
    long countAllByActivityUserId(String userId);

    List<UserLog> findAllByActivityUserIdAndUserSessionId(String userId, String userSessionId, Pageable pageable);

    long countAllByActivityUserIdAndUserSessionId(String userId, String userSessionId);
}
