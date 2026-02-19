import type { Meta, StoryObj } from "@storybook/react"
import DateRangePicker from "../components/DateRangePicker/DateRangePicker"
import { createZonedMidnightInstant } from "../utils/calender"

const meta: Meta<typeof DateRangePicker> = {
  title: "EdgeCases/DST",
  component: DateRangePicker,
}

export default meta
type Story = StoryObj<typeof DateRangePicker>

// DST boundary instants
const springStart = createZonedMidnightInstant(
  2026,
  2, // March (0-based)
  8,
  "America/New_York"
)

const fallStart = createZonedMidnightInstant(
  2026,
  10, // November
  1,
  "America/New_York"
)

/**
 * US Spring Forward 2026
 * March 8, 2026 (2AM → 3AM skip)
*/
export const SpringForward: Story = {
  args: {
    defaultTimeZone: "America/New_York",
    constraints: {
      min: springStart,
    },
  },
}

/**
 * US Fall Back 2026
 * November 1, 2026 (2AM repeats)
 */
export const FallBack: Story = {
  args: {
    defaultTimeZone: "America/New_York",
    constraints: {
      min: fallStart,
    },
  },
}
