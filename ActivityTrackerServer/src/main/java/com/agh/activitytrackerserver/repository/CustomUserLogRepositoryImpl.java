package com.agh.activitytrackerserver.repository;

import com.agh.activitytrackerclient.models.UserLog;

import com.agh.activitytrackerclient.models.UserWithLogsCount;
import com.agh.activitytrackerserver.transport.EndpointNameWithCount;
import com.agh.activitytrackerserver.transport.EndpointsQuery;
import com.agh.activitytrackerserver.transport.TimeRange;
import com.agh.activitytrackerserver.transport.UsersWithOverviewQuery;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;

@Repository
public class CustomUserLogRepositoryImpl implements CustomUserLogRepository {
    private final EntityManager em;

    public CustomUserLogRepositoryImpl(EntityManager em) {

        this.em = em;
    }
    @Override
    public List<EndpointNameWithCount> findMostPopularEndpointNames(EndpointsQuery query) {
        CriteriaBuilder criteriaBuilder = this.em.getCriteriaBuilder();
        CriteriaQuery<EndpointNameWithCount> q = criteriaBuilder
                .createQuery(EndpointNameWithCount.class);

        Root<UserLog> root = q.from(UserLog.class);

        q.multiselect(root.get("endpoint"), criteriaBuilder.count(root));

        switch(query.getSortingProperty()){
            case ACTIVITY_FREQUENCY:
                q.groupBy(root.get("endpoint"));
                break;
        }

        switch(query.getSortingDirection()) {
            case ASC:
                q.orderBy(criteriaBuilder.asc(criteriaBuilder.count(root.get("endpoint"))));
                break;
            case DESC:
                q.orderBy(criteriaBuilder.desc(criteriaBuilder.count(root.get("endpoint"))));
                break;
        };
        ArrayList<Predicate> predicates = new ArrayList<Predicate>();

        var ep = query.getEndpointName();
        if(ep != null && ep.length() > 0) {
            predicates.add(criteriaBuilder.like(root.get("endpoint").as(String.class), "%" + ep + "%"));
        }
        var userId = query.getActivityUserId();

        if(userId != null && userId.length() > 0) {
            predicates.add(criteriaBuilder.equal(root.get("activityUserId"), userId));
        }

        TimeRange timeRange = query.getTimeRange();

        if (timeRange != null) {
            if (timeRange.getTo() > 0) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("activityEnd"), timeRange.getTo()));
            }
            if (timeRange.getFrom() > 0) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("activityEnd"), timeRange.getFrom()));
            }
        }

        if (!predicates.isEmpty()) {
            q.where(predicates.toArray(new Predicate[0]));
        }

        return em.createQuery(q)
                .setFirstResult(query.getPage())
                .setMaxResults(query.getPageSize())
                .getResultList();
    }

    @Override
    public List<UserWithLogsCount> getUserIdsWithMostActivity(UsersWithOverviewQuery query) {
        CriteriaBuilder criteriaBuilder = this.em.getCriteriaBuilder();
        CriteriaQuery<UserWithLogsCount> q = criteriaBuilder
                .createQuery(UserWithLogsCount.class);

        Root<UserLog> root = q.from(UserLog.class);

        q.multiselect(root.get("activityUserId"), criteriaBuilder.count(root));

        q.groupBy(root.get("activityUserId"));

        switch(query.getSortingDirection()) {
            case ASC:
                q.orderBy(criteriaBuilder.asc(criteriaBuilder.count(root.get("activityUserId"))));
                break;
            case DESC:
                q.orderBy(criteriaBuilder.desc(criteriaBuilder.count(root.get("activityUserId"))));
                break;
        };
        ArrayList<Predicate> predicates = new ArrayList<Predicate>();

        predicates.add(criteriaBuilder.isNotNull(root.get("activityUserId")));

        TimeRange timeRange = query.getTimeRange();

        if (timeRange != null) {
            if (timeRange.getTo() > 0) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("activityEnd"), timeRange.getTo()));
            }
            if (timeRange.getFrom() > 0) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("activityEnd"), timeRange.getFrom()));
            }
        }

        if (!predicates.isEmpty()) {
            q.where(predicates.toArray(new Predicate[0]));
        }

        return em.createQuery(q)
                .setFirstResult(query.getPage())
                .setMaxResults(query.getPageSize())
                .getResultList();
    }
}
