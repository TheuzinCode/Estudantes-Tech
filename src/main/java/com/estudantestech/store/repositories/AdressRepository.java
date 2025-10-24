package com.estudantestech.store.repositories;

import com.estudantestech.store.domain.adress.Adress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AdressRepository extends JpaRepository<Adress, Long> {
    List<Adress> findByClient_ClientId(UUID clientId);

    Optional<Adress> findByClient_ClientIdAndIsDefaultTrue(UUID clientId);

    Optional<Adress> findByAdressIdAndClient_ClientId(Long adressId, UUID clientId);
}
