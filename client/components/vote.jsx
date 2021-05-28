import React from 'react';
import { useParams } from 'react-router-dom';
import * as V from '@vestaboard/installables';

const Vote = ({ state }) => {
  const { id } = useParams();

  return (
  <div className="vote">
    <div className="title">
      <V.Title>Vestaboard Poll</V.Title>
      <V.SubTitle>{id.toUpperCase()}</V.SubTitle>
    </div>
    <div className="q-a-section">
      <div className="question">
        <V.SubTitle>{state.question}</V.SubTitle>
      </div>
      <div className="answer-set">
        <div className="answer answer-a">
          <V.Button buttonType="outline" endIcon={<V.Icon color="white" type="" />}>A. {state.a}</V.Button>
        </div>
        <div className="answer answer-b chosen">
          <V.Button buttonType="outline" endIcon={<V.Icon color="white" type="" />}>B. {state.b}</V.Button>
        </div>
        <div className="answer answer-c">
          {state.c
            ? <V.Button buttonType="outline" endIcon={<V.Icon color="white" type="" />}>C. {state.c}</V.Button>
            : null
          }
        </div>
      </div>
    </div>
    <div className="footer">
      <V.Small>Made by Shane Sutro</V.Small>
    </div>
  </div>
  );
};

export default Vote;
