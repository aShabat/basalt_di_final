import { RefObject, useContext, useEffect, useRef, useState } from "react"
import Props from "./Props"
import UserContext from "./UserContext"
import { getLinks } from "./api"

interface Point {
  x: number
  y: number
  vx: number
  vy: number
  path: string
}

interface Edge {
  from: number
  to: number
  weight: number
}

interface PointProps extends Props {
  x: number
  y: number
  i: number
  movingRef: RefObject<number | undefined>
  mouseX: RefObject<number>
  mouseY: RefObject<number>
  mouseXAbsolute: RefObject<number>
  mouseYAbsolute: RefObject<number>
}
function Point({
  x,
  y,
  i,
  movingRef,
  mouseX,
  mouseXAbsolute,
  mouseY,
  mouseYAbsolute,
}: PointProps) {
  //@ts-ignore
  function handleMouseDown(e) {
    movingRef.current = i
    mouseXAbsolute.current = e.clientX
    mouseYAbsolute.current = e.clientY
    mouseX.current = x
    mouseY.current = y
  }
  return <circle r={10} cx={x} cy={y} onMouseDown={handleMouseDown} />
}

interface GraphProps extends Props {}
export default function Graph({ className }: GraphProps) {
  const graph = useRef<SVGSVGElement>(null)
  const [user, _] = useContext(UserContext)
  const [points, setPoints] = useState<Point[]>()
  const [edges, setEdges] = useState<Edge[]>()
  const [animationFlag, setAnimationFlag] = useState(0)
  const mousePointRef = useRef<number>(undefined)
  const mouseXRef = useRef(0)
  const mouseYRef = useRef(0)
  const mouseXStartRef = useRef(0)
  const mouseYStartRef = useRef(0)
  const mouseXStartSVGRef = useRef(0)
  const mouseYStartSVGRef = useRef(0)

  function animationTick() {
    if (!points) return
    const k = 1e-1
    const t = 0.1
    const l_min = 50
    const l_max = 300

    if (!points || !edges) return
    const forces = points.map((_) => [0, 0])
    for (const { from, to, weight } of edges) {
      const first = points[from]
      const second = points[to]
      const len_current = Math.sqrt(
        Math.pow(first.x - second.x, 2) + Math.pow(first.y - second.y, 2),
      )
      const len_goal = l_min * (1 + (l_max / l_min - 1) / (weight + 1))
      const force = k * (len_current - len_goal)
      forces[from][0] += -(force * (first.x - second.x)) / len_current
      forces[from][1] += -(force * (first.y - second.y)) / len_current
      forces[to][0] += (force * (first.x - second.x)) / len_current
      forces[to][1] += (force * (first.y - second.y)) / len_current
    }

    setPoints(
      points.map(({ path, x, y, vx, vy }, i) =>
        i === mousePointRef.current
          ? {
              path,
              x:
                mouseXStartSVGRef.current +
                mouseXRef.current -
                mouseXStartRef.current,
              y:
                mouseYStartSVGRef.current +
                mouseYRef.current -
                mouseYStartRef.current,
              vx: 0,
              vy: 0,
            }
          : {
              path,
              x: x + vx,
              y: y + vy,
              vx: vx * t + forces[i][0],
              vy: vy * t + forces[i][1],
            },
      ),
    )
  }

  useEffect(() => {
    ;(async () => {
      if (!user) return
      if (!points) {
        const links = await getLinks(user)
        const paths = Array.from(
          new Set([...links.map((l) => l.from), ...links.map((l) => l.to)]),
        )
        setPoints(
          paths.map((p) => ({
            path: p,
            x: Math.random() * 400 + 50,
            y: Math.random() * 400 + 50,
            drag: false,
            vx: 0,
            vy: 0,
          })),
        )

        const edgeConstructor: Edge[] = []
        for (let i = 0; i < paths.length; i++) {
          for (let j = i + 1; j < paths.length; j++) {
            edgeConstructor.push({
              from: i,
              to: j,
              weight: links
                .filter(
                  ({ from, to }) =>
                    (from === paths[i] && to === paths[j]) ||
                    (from === paths[j] && to === paths[i]),
                )
                .reduce((acc, l) => acc + l.weight, 0),
            })
          }
        }
        setEdges(edgeConstructor)
        setAnimationFlag(animationFlag + 1)
      }
    })()
  }, [user])

  useEffect(() => {
    const animationId = setInterval(() => {
      animationTick()
    }, 100)
    return () => {
      clearInterval(animationId)
    }
  })

  return (
    <svg
      className={className}
      ref={graph}
      width={500}
      height={500}
      onMouseMove={(e) => {
        mouseXRef.current = e.clientX
        mouseYRef.current = e.clientY
      }}
      onMouseUp={() => (mousePointRef.current = undefined)}
    >
      <rect width={"100%"} height={"100%"} fill="red" />
      {points &&
        points.map((p, i) => {
          return (
            <Point
              x={p.x}
              y={p.y}
              i={i}
              movingRef={mousePointRef}
              mouseX={mouseXStartSVGRef}
              mouseY={mouseYStartSVGRef}
              mouseXAbsolute={mouseXStartRef}
              mouseYAbsolute={mouseYStartRef}
            />
          )
        })}
      {edges &&
        edges
          .filter(({ weight }) => weight > 0)
          .map(({ from, to }) => {
            return (
              <line
                x1={points![from].x}
                y1={points![from].y}
                x2={points![to].x}
                y2={points![to].y}
                stroke="black"
                strokeWidth={1}
              />
            )
          })}
    </svg>
  )
}
