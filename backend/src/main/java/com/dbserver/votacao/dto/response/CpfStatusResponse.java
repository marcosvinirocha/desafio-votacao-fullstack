package com.dbserver.votacao.dto.response;

import com.dbserver.votacao.model.enums.StatusVoto;

public record CpfStatusResponse(
        StatusVoto status
) {
    public boolean isAbleToVote() {
        return StatusVoto.ABLE_TO_VOTE.equals(status);
    }
}
