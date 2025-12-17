"use client"

import Timeline from "@mui/lab/Timeline"
import TimelineItem from "@mui/lab/TimelineItem"
import TimelineSeparator from "@mui/lab/TimelineSeparator"
import TimelineConnector from "@mui/lab/TimelineConnector"
import TimelineContent from "@mui/lab/TimelineContent"
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent"
import TimelineDot from "@mui/lab/TimelineDot"
import Typography from "@mui/material/Typography"

import { useCambioEstado } from "../../cliente/reclamos/hooks/use-cambio-estado"

export function ReclamoTimeline({ reclamoId }: { reclamoId: string }) {
  const { data = [] } = useCambioEstado(reclamoId)

  return (
    <Timeline position="alternate">
      {data.map((cambio: any) => (
        <TimelineItem key={cambio.id}>
          <TimelineOppositeContent color="text.secondary">
            {new Date(cambio.fechaInicio).toLocaleString()}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Typography variant="h6">{cambio.estado}</Typography>
            <Typography>{cambio.area?.nombre}</Typography>
            <Typography variant="body2">{cambio.descripcion}</Typography>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}
