/* eslint-disable no-nested-ternary */
import React from 'react';
import { useParams } from 'react-router-dom';
import * as V from '@vestaboard/installables';

const Vote = ({ poll, actions }) => {
  const { id } = useParams();
  console.log(id);
  const { saveVote } = actions;

  return (
    <div className="vote">
      <div className="title">
        <V.Title>Vestaboard Poll</V.Title>
        <V.SubTitle>{id.toUpperCase()}</V.SubTitle>
      </div>
      <div className="q-a-section">
        <div className="question">
          <V.SubTitle>{poll.question}</V.SubTitle>
        </div>
        {poll.question === '' ? (
          <div>
            <V.Title>Well this is awkward.</V.Title>
            <V.SubTitle2>I don't have that poll in my system.</V.SubTitle2>
          </div>
        ) : !poll.isOpen
          ? (
            <div>
              <div className="answer-set">
                <div className="answer answer-a">
                  <V.Button
                    onClick={() => { }}
                    buttonType="outline"
                    endIcon={<V.Icon color="white" type="" />}
                  >
                    A.
                    {' '}
                    {poll.a}
                  </V.Button>
                </div>
                <div className="answer answer-b">
                  <V.Button
                    onClick={() => { }}
                    buttonType="outline"
                    endIcon={<V.Icon color="white" type="" />}
                  >
                    B.
                    {' '}
                    {poll.b}
                  </V.Button>
                </div>
                <div className="answer answer-c">
                  {poll.c ? (
                    <V.Button
                      onClick={() => { }}
                      buttonType="outline"
                      endIcon={<V.Icon color="white" type="" />}
                    >
                      C.
                      {' '}
                      {poll.c}
                    </V.Button>
                  ) : null}
                </div>
                <V.Title>This poll is closed!</V.Title>
              </div>
            </div>
          )
          : (
            <div className="answer-set">
              <div className="answer answer-a">
                <V.Button
                  onClick={() => saveVote('a')}
                  buttonType="outline"
                  endIcon={<V.Icon color="white" type="" />}
                >
                  A.
                  {' '}
                  {poll.a}
                </V.Button>
              </div>
              <div className="answer answer-b">
                <V.Button
                  onClick={() => saveVote('b')}
                  buttonType="outline"
                  endIcon={<V.Icon color="white" type="" />}
                >
                  B.
                  {' '}
                  {poll.b}
                </V.Button>
              </div>
              <div className="answer answer-c">
                {poll.c ? (
                  <V.Button
                    onClick={() => saveVote('c')}
                    buttonType="outline"
                    endIcon={<V.Icon color="white" type="" />}
                  >
                    C.
                    {' '}
                    {poll.c}
                  </V.Button>
                ) : null}
              </div>
            </div>
          )}
      </div>
      <div className="footer">
        <V.Small>Made by Shane Sutro</V.Small>
      </div>
    </div>
  );
};

export default Vote;
