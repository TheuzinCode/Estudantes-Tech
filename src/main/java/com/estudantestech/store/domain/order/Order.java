package com.estudantestech.store.domain.order;


import com.estudantestech.store.domain.client.Client;
import com.estudantestech.store.domain.product.Product;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Orders")
@Getter
@Setter
public class Order {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    @ManyToOne
    @JoinColumn(name = "clientId")
    private Client client;

    private BigDecimal totalValue;

    private String status = "AGUARDANDO_PAGAMENTO";

    private String parcelas;

    private String paymentMethod;

    @CreationTimestamp
    private Instant creationTimestamp;

    @OneToMany(mappedBy = "order",cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemOrder> itens = new ArrayList<>();

    public void adicionarItens(ItemOrder item){
        this.itens.add(item);
        item.setOrder(this);
    }

}
