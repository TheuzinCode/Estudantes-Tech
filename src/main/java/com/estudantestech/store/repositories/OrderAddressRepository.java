package com.estudantestech.store.repositories;

import com.estudantestech.store.domain.adress.Adress;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderAddressRepository extends JpaRepository<Adress, Long> {


}
