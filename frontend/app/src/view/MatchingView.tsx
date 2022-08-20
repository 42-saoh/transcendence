import { Button, Stack, Typography } from '@mui/material'
import { PongSocketContext } from 'router'
import { useState, useContext, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'

const PingPongAnimation = keyframes`
  from { left: 4%; }
  to { left: 94%; }
`
const Wrapper = styled.div`
  width: 600px;
  height: 300px;
  margin-bottom: 2px;
  background-color: black;
  position: relative;
`

const PingPongComponent = `
  top: 50%;
  transform: translateY(-50%);
  background-color: white;
  position: absolute;
`

const ElapsedTimeHolder = styled.p`
  box-sizing: border-box;
  top: 3%;
  width: 100%;
  position: absolute;
  background-color: aqua;
  padding-left: 10%;
  font-size: 1.3rem;
`

const LeftPaddle = styled.div`
  ${PingPongComponent}
  width: 2%;
  height: 20%;
  left: 2%;
`

const Ball = styled.div`
  ${PingPongComponent}
  width: 2%;
  height: 4%;
  animation-name: ${PingPongAnimation};
  animation-duration: 2s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  animation-timing-function: linear;
`

const RightPaddle = styled.div`
  ${PingPongComponent}
  width: 2%;
  height: 20%;
  right: 2%;
`

const MatchCancelButton = styled.button`
  width: 600px;
  background-color: black;
  color: #cccccc;
`

const msToSecondsAndMinutes = (ms: number) => {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms - minutes * 60000) / 1000)

  return {
    seconds,
    minutes,
  }
}
const ElapsedTime = (props: { startedAt: number }) => {
  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(Date.now() - props.startedAt)
    }, 100)

    return () => {
      clearInterval(interval)
    }
  }, [props.startedAt])

  const { seconds, minutes } = msToSecondsAndMinutes(elapsedTime)

  return (
    <ElapsedTimeHolder>
      적절한 상대를 찾는중 :{' '}
      {`[${minutes}:${seconds.toString().padStart(2, '0')}]`}
    </ElapsedTimeHolder>
  )
}

export const MatchingView = (props: { handleCancel: () => void }) => {
  const socket = useContext(PongSocketContext)

  return (
    <div>
      <Wrapper>
        <ElapsedTime startedAt={Date.now()} />
        <LeftPaddle />
        <Ball />
        <RightPaddle />
      </Wrapper>
      <MatchCancelButton
        onClick={() => {
          socket?.emit('cancelMatch')
          props.handleCancel()
        }}
      >
        매치 취소
      </MatchCancelButton>
    </div>
  )
}