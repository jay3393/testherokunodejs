import React from "react";
import styled from "styled-components";

export default function NewContact({currentChat}) {
  return (
    <>
        <Container>
            <h1>{`You don't have any messages with ${currentChat.username}`}</h1>
            <h3>Start a conversation with <span>{currentChat.username}</span>!</h3>
        </Container>
    </>
  )
}

const Container = styled.div`
    h1, h3 {
        color: white;
    }

    span {
        color: #4e00ff;
    }
`;