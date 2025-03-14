'use client'

import Xarrow from 'react-xarrows'

export default function Lines({lines}) {
  // console.log(lines)
  // lines.map(line => {
  //   console.log(line.color ? line.color : "white")
  // })
  return (
    <div>
      { lines.map((line, idx) => {
        return <Xarrow start={line.from} end={line.to} showHead={false} color={line.color ? line.color : "#FFF8"} dashness={true} strokeWidth={2}/>
      })}
    </div>
  );
}
