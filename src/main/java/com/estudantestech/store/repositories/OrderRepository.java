package com.estudantestech.store.repositories;

import com.estudantestech.store.domain.order.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByClientClientId(UUID clientId);


}
