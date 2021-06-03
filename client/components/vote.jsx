/* eslint-disable no-nested-ternary */
import React from 'react';
import { useParams } from 'react-router-dom';
import * as V from '@vestaboard/installables';

const errorPhrases = [
  'We\'ve gotta stop meeting like this.',
  'Someone gave you bad directions.',
  'Well this is awkward.',
  'Task failed successfully.',
  '😬😬😬',
  'Here\'s a teddy bear instead 🧸',
];

const Vote = ({ poll, actions, chosen }) => {
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
            <V.Title>{errorPhrases[Math.floor(Math.random() * errorPhrases.length)]}</V.Title>
            <V.SubTitle2>I don&apos;t have that poll in my system.</V.SubTitle2>
          </div>
        ) : !poll.isOpen ? (
          <div>
            <div className="answer-set">
              <div className={`answer answer-a ${chosen === 'a' ? 'chosen' : ''}`}>
                <V.Button
                  onClick={() => {}}
                  buttonType="outline"
                  endIcon={<V.Icon color="white" type="" />}
                >
                  A.
                  {' '}
                  {poll.a}
                </V.Button>
              </div>
              <div className={`answer answer-b ${chosen === 'b' ? 'chosen' : ''}`}>
                <V.Button
                  onClick={() => {}}
                  buttonType="outline"
                  endIcon={<V.Icon color="white" type="" />}
                >
                  B.
                  {' '}
                  {poll.b}
                </V.Button>
              </div>
              <div className={`answer answer-c ${chosen === 'c' ? 'chosen' : ''}`}>
                {poll.c ? (
                  <V.Button
                    onClick={() => {}}
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
        ) : (
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
