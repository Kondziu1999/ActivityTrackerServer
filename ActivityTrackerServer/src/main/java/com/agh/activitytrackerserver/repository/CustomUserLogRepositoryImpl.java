package com.agh.activitytrackerserver.repository;

import com.agh.activitytrackerclient.models.ActivityUser;
import com.agh.activitytrackerclient.models.UserLog;

import com.agh.activitytrackerclient.models.UserWithLogsCount;
import com.agh.activitytrackerserver.transport.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Repository
public class CustomUserLogRepositoryImpl implements CustomUserLogRepository {
    private final ActivityUserRepository activityUserRepository;
    private final EntityManager em;

    public CustomUserLogRepositoryImpl(ActivityUserRepository activityUserRepository, EntityManager em) {
        this.activityUserRepository = activityUserRepository;
        this.em = em;
    }

    // cq - count query
    // q - normal query
    @Override
    public List<UserLog> getAllUserLogs(String userId, TimeRange timeRange, SortingDirection sortingDirection) {
        CriteriaBuilder criteriaBuilder = this.em.getCriteriaBuilder();
        CriteriaQuery<UserLog> q = criteriaBuilder
                .createQuery(UserLog.class);

        Root<UserLog> root = q.from(UserLog.class);
        ArrayList<Predicate> predicates = new ArrayList<>();

        predicates.add(criteriaBuilder.equal(root.get("activityUserId").as(String.class), userId));
        predicates.addAll(getTimeRangePredicates(timeRange, root, criteriaBuilder));

        q.select(root);
        q.where(predicates.toArray(new Predicate[0]));

        switch(sortingDirection) {
            case ASC:
                q.orderBy(criteriaBuilder.asc(root.get("activityEnd")));
                break;
            case DESC:
                q.orderBy(criteriaBuilder.desc(root.get("activityEnd")));
                break;
        }

        return em.createQuery(q)
                .getResultList();
    }

    @Override
    public PageResponse<UserLog> getUserLogs(GetLogsForUserQuery query) {
        CriteriaBuilder criteriaBuilder = this.em.getCriteriaBuilder();
        CriteriaQuery<UserLog> q = criteriaBuilder
                .createQuery(UserLog.class);

        CriteriaQuery<Long> cq = criteriaBuilder.createQuery(Long.class);

        Root<UserLog> root = q.from(UserLog.class);
        Root<UserLog> cRoot = cq.from(UserLog.class);

        ArrayList<Predicate> predicates = new ArrayList<>();
        ArrayList<Predicate> cPredicates = new ArrayList<>();

        predicates.add(criteriaBuilder.equal(root.get("activityUserId").as(String.class),  query.getUserId()));
        cPredicates.add(criteriaBuilder.equal(cRoot.get("activityUserId").as(String.class),  query.getUserId()));

        predicates.addAll(getTimeRangePredicates(query.getTimeRange(), root, criteriaBuilder));
        cPredicates.addAll(getTimeRangePredicates(query.getTimeRange(), cRoot, criteriaBuilder));

        if(query.getSessionId() != null && query.getSessionId().length() > 0) {
            predicates.add(criteriaBuilder.equal(root.get("userSessionId").as(String.class),  query.getSessionId()));
            cPredicates.add(criteriaBuilder.equal(cRoot.get("userSessionId").as(String.class),  query.getSessionId()));
        }

        q.select(root);
        cq.select(criteriaBuilder.count(cRoot));

        q.where(predicates.toArray(new Predicate[0]));
        cq.where(cPredicates.toArray(new Predicate[0]));

        switch(query.getSortingDirection()) {
            case ASC:
                q.orderBy(criteriaBuilder.asc(root.get("activityEnd")));
                break;
            case DESC:
                q.orderBy(criteriaBuilder.desc(root.get("activityEnd")));
                break;
        }

        List<UserLog> results = em.createQuery(q)
                .setFirstResult(query.getPage() * query.getPageSize())
                .setMaxResults(query.getPageSize())
                .getResultList();

        long total = em.createQuery(cq).getSingleResult();

        return new PageResponse<>(results, total);
    }


    @Override
    public PageResponse<EndpointNameWithCount> getUserLogsCountPerEndpoint(UserLogsCountPerEndpointQuery query) {
        CriteriaBuilder criteriaBuilder = this.em.getCriteriaBuilder();
        CriteriaQuery<EndpointNameWithCount> q = criteriaBuilder
                .createQuery(EndpointNameWithCount.class);

        CriteriaQuery<Long> cq = criteriaBuilder.createQuery(Long.class);

        Root<UserLog> root = q.from(UserLog.class);
        Root<UserLog> cRoot = cq.from(UserLog.class);

        ArrayList<Predicate> predicates = new ArrayList<>();
        ArrayList<Predicate> cPredicates = new ArrayList<>();

        predicates.add(criteriaBuilder.equal(root.get("activityUserId").as(String.class),  query.getUserId()));
        cPredicates.add(criteriaBuilder.equal(cRoot.get("activityUserId").as(String.class),  query.getUserId()));

        predicates.addAll(getTimeRangePredicates(query.getTimeRange(), root, criteriaBuilder));
        cPredicates.addAll(getTimeRangePredicates(query.getTimeRange(), cRoot, criteriaBuilder));

        q.multiselect(root.get("endpoint"), criteriaBuilder.count(root));
        cq.select(criteriaBuilder.countDistinct(cRoot.get("endpoint")));

        q.groupBy(root.get("endpoint"));

        q.where(predicates.toArray(new Predicate[0]));
        cq.where(cPredicates.toArray(new Predicate[0]));

        switch(query.getSortingDirection()) {
            case ASC:
                q.orderBy(criteriaBuilder.asc(criteriaBuilder.count(root.get("endpoint"))));
                break;
            case DESC:
                q.orderBy(criteriaBuilder.desc(criteriaBuilder.count(root.get("endpoint"))));
                break;
        }

        List<EndpointNameWithCount> results = em.createQuery(q)
                .setFirstResult(query.getPage() * query.getPageSize())
                .setMaxResults(query.getPageSize())
                .getResultList();

        long total = em.createQuery(cq).getSingleResult();

        return new PageResponse<>(results, total);
    }

    @Override
    public List<UserLog> getUserLogsForTimeRangeAsc(String userId, TimeRange timeRange) {
        CriteriaBuilder criteriaBuilder = this.em.getCriteriaBuilder();
        CriteriaQuery<UserLog> q = criteriaBuilder
                .createQuery(UserLog.class);

        Root<UserLog> root = q.from(UserLog.class);

        ArrayList<Predicate> predicates = new ArrayList<>();

        predicates.addAll(getTimeRangePredicates(timeRange, root, criteriaBuilder));
        predicates.add(criteriaBuilder.equal(root.get("activityUserId").as(String.class), userId));

        q.select(root);
        q.where(predicates.toArray(new Predicate[0]));
        q.orderBy(criteriaBuilder.asc(root.get("activityEnd")));

        return em.createQuery(q).getResultList();
    }

    @Override
    public PageResponse<UserLog> getEndpointLogs(EndpointLogsQuery query) {
        CriteriaBuilder criteriaBuilder = this.em.getCriteriaBuilder();
        CriteriaQuery<UserLog> q = criteriaBuilder
                .createQuery(UserLog.class);

        CriteriaQuery<Long> cq = criteriaBuilder.createQuery(Long.class);

        Root<UserLog> root = q.from(UserLog.class);
        Root<UserLog> cRoot = cq.from(UserLog.class);

        ArrayList<Predicate> predicates = new ArrayList<>();
        ArrayList<Predicate> cPredicates = new ArrayList<>();

        predicates.add(criteriaBuilder.equal(root.get("endpoint").as(String.class), query.getEndpointName()));
        cPredicates.add(criteriaBuilder.equal(cRoot.get("endpoint").as(String.class), query.getEndpointName()));

        predicates.addAll(getTimeRangePredicates(query.getTimeRange(), root, criteriaBuilder));
        cPredicates.addAll(getTimeRangePredicates(query.getTimeRange(), cRoot, criteriaBuilder));

        q.select(root);
        cq.select(criteriaBuilder.count(cRoot));

        q.where(predicates.toArray(new Predicate[0]));
        cq.where(cPredicates.toArray(new Predicate[0]));

        switch(query.getSortingDirection()) {
            case ASC:
                q.orderBy(criteriaBuilder.asc(root.get("activityEnd")));
                break;
            case DESC:
                q.orderBy(criteriaBuilder.desc(root.get("activityEnd")));
                break;
        }

        List<UserLog> logs = em.createQuery(q)
                .setFirstResult(query.getPage() * query.getPageSize())
                .setMaxResults(query.getPageSize())
                .getResultList();

        long total = em.createQuery(cq).getSingleResult();

        return new PageResponse<>(logs, total);
    }

    @Override
    public PageResponse<EndpointHitCountPerUser> getEndpointHitCountPerUser(EndpointHitCountPerUserQuery query) {
        CriteriaBuilder criteriaBuilder = this.em.getCriteriaBuilder();
        CriteriaQuery<EndpointHitCountPerUser> q = criteriaBuilder
                .createQuery(EndpointHitCountPerUser.class);

        CriteriaQuery<Long> cq = criteriaBuilder.createQuery(Long.class);

        Root<UserLog> root = q.from(UserLog.class);
        Root<UserLog> cRoot = cq.from(UserLog.class);

        ArrayList<Predicate> predicates = new ArrayList<>();
        ArrayList<Predicate> cPredicates = new ArrayList<>();

        predicates.add(criteriaBuilder.isNotNull(root.get("activityUserId")));
        cPredicates.add(criteriaBuilder.isNotNull(cRoot.get("activityUserId")));

        predicates.add(criteriaBuilder.equal(root.get("endpoint").as(String.class),  query.getEndpointName()));
        cPredicates.add(criteriaBuilder.equal(cRoot.get("endpoint").as(String.class),  query.getEndpointName()));

        predicates.addAll(getTimeRangePredicates(query.getTimeRange(), root, criteriaBuilder));
        cPredicates.addAll(getTimeRangePredicates(query.getTimeRange(), cRoot, criteriaBuilder));

        q.multiselect(root.get("activityUserId"), criteriaBuilder.count(root));
        cq.select(criteriaBuilder.countDistinct(cRoot.get("activityUserId")));

        q.groupBy(root.get("activityUserId"));

        q.where(predicates.toArray(new Predicate[0]));
        cq.where(cPredicates.toArray(new Predicate[0]));

        List<EndpointHitCountPerUser> results = em.createQuery(q)
                .setFirstResult(query.getPage() * query.getPageSize())
                .setMaxResults(query.getPageSize())
                .getResultList();

        long total = em.createQuery(cq).getSingleResult();

        return new PageResponse<>(results, total);
    }

    @Override
    public EndpointHitCount getEndpointHitCount(EndpointHitCountQuery query) {
        CriteriaBuilder criteriaBuilder = this.em.getCriteriaBuilder();
        CriteriaQuery<Long> q = criteriaBuilder
                .createQuery(Long.class);

        Root<UserLog> root = q.from(UserLog.class);

        ArrayList<Predicate> predicates = new ArrayList<>();

        predicates.add(criteriaBuilder.equal(root.get("endpoint").as(String.class),  query.getEndpointName()));
        predicates.addAll(getTimeRangePredicates(query.getTimeRange(), root, criteriaBuilder));

        q.select(criteriaBuilder.count(root));
        q.where(predicates.toArray(new Predicate[0]));

        long count = em.createQuery(q).getSingleResult();

        return new EndpointHitCount(query.getEndpointName(), count);
    }

    @Override
    public PageResponse<EndpointNameWithCount> findMostPopularEndpointNames(EndpointsQuery query) {
        CriteriaBuilder criteriaBuilder = this.em.getCriteriaBuilder();
        CriteriaQuery<EndpointNameWithCount> q = criteriaBuilder
                .createQuery(EndpointNameWithCount.class);

        CriteriaQuery<String> cq = criteriaBuilder.createQuery(String.class);

        Root<UserLog> root = q.from(UserLog.class);
        Root<UserLog> cRoot = cq.from(UserLog.class);

        cq.select(cRoot.get("endpoint")).distinct(true);

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
        }

        ArrayList<Predicate> predicates = new ArrayList<>();
        ArrayList<Predicate> cPredicates = new ArrayList<>();

        var ep = query.getEndpointName();
        if(ep != null && ep.length() > 0) {
            predicates.add(criteriaBuilder.like(root.get("endpoint").as(String.class), "%" + ep + "%"));
            cPredicates.add(criteriaBuilder.like(cRoot.get("endpoint").as(String.class), "%" + ep + "%"));
        }
        var userId = query.getActivityUserId();

        if(userId != null && userId.length() > 0) {
            predicates.add(criteriaBuilder.equal(root.get("activityUserId"), userId));
            cPredicates.add(criteriaBuilder.equal(cRoot.get("activityUserId"), userId));
        }

        predicates.addAll(getTimeRangePredicates(query.getTimeRange(), root, criteriaBuilder));
        cPredicates.addAll(getTimeRangePredicates(query.getTimeRange(), cRoot, criteriaBuilder));

        if (!predicates.isEmpty()) {
            q.where(predicates.toArray(new Predicate[0]));
            cq.where(cPredicates.toArray(new Predicate[0]));
        }

        List<EndpointNameWithCount> results = em.createQuery(q)
                .setFirstResult(query.getPage() * query.getPageSize())
                .setMaxResults(query.getPageSize())
                .getResultList();

        List<String> uniqueEndpoints = em.createQuery(cq).getResultList();

        return new PageResponse<>(results, uniqueEndpoints.size());
    }

    @Override
    public PageResponse<UserWithLogsCount> getUserIdsWithMostActivity(UsersWithOverviewQuery query) {
        CriteriaBuilder criteriaBuilder = this.em.getCriteriaBuilder();
        CriteriaQuery<UserWithLogsCount> q = criteriaBuilder
                .createQuery(UserWithLogsCount.class);

        Root<UserLog> root = q.from(UserLog.class);
        CriteriaQuery<String> cq = criteriaBuilder.createQuery(String.class);

        Root<UserLog> cRoot = cq.from(UserLog.class);
        cq.select(cRoot.get("activityUserId")).distinct(true);

        q.multiselect(root.get("activityUserId"), criteriaBuilder.count(root));

        q.groupBy(root.get("activityUserId"));

        switch(query.getSortingDirection()) {
            case ASC:
                q.orderBy(criteriaBuilder.asc(criteriaBuilder.count(root.get("activityUserId"))));
                break;
            case DESC:
                q.orderBy(criteriaBuilder.desc(criteriaBuilder.count(root.get("activityUserId"))));
                break;
        }
        ArrayList<Predicate> predicates = new ArrayList<>();
        ArrayList<Predicate> cPredicates = new ArrayList<>();

        predicates.add(criteriaBuilder.isNotNull(root.get("activityUserId")));
        cPredicates.add(criteriaBuilder.isNotNull(cRoot.get("activityUserId")));

        predicates.addAll(getTimeRangePredicates(query.getTimeRange(), root, criteriaBuilder));
        cPredicates.addAll(getTimeRangePredicates(query.getTimeRange(), cRoot, criteriaBuilder));

        q.where(predicates.toArray(new Predicate[0]));
        cq.where(cPredicates.toArray(new Predicate[0]));

        List<String> uniqueUserIds = em.createQuery(cq).getResultList();
        var uniqueUsers = getActivityUsersWhereIdIn(uniqueUserIds);

        // Log don't have to have activity user so join is not an option(at least not in easy way :D)
        String username = query.getUsername();
        if (username != null && username.length() > 0) {
            uniqueUsers = uniqueUsers
                    .stream()
                    .filter(x -> x.getUsername().toLowerCase().matches(".*"+ username.toLowerCase() + ".*"))
                    .collect(Collectors.toList());
        }

        List<UserWithLogsCount> results = em.createQuery(q)
                .setFirstResult(query.getPage() * query.getPageSize())
                .setMaxResults(query.getPageSize())
                .getResultList();

        List<UserWithLogsCount> fiteredByUsernameResults = new LinkedList<>();

        for(var userWithCount: results) {
            if(uniqueUsers.stream().anyMatch(u -> Objects.equals(u.getId(), userWithCount.getActivityUserId()))){
                fiteredByUsernameResults.add(userWithCount);
            }
        }

        return new PageResponse<>(fiteredByUsernameResults, uniqueUsers.size());
    }

    private List<ActivityUser> getActivityUsersWhereIdIn(List<String> ids) {
        return activityUserRepository.findAllById(ids);
    }

    private <T> List<Predicate> getTimeRangePredicates(TimeRange timeRange, Root<T> root, CriteriaBuilder criteriaBuilder) {
        ArrayList<Predicate> predicates = new ArrayList<>();

        if (timeRange != null) {
            if (timeRange.getTo() > 0) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("activityEnd"), timeRange.getTo()));
            }
            if (timeRange.getFrom() > 0) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("activityEnd"), timeRange.getFrom()));
            }
        }

        return  predicates;
    }
}
