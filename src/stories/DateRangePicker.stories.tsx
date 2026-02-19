import type { Meta, StoryObj } from "@storybook/react"
import DateRangePicker from "../components/DateRangePicker/DateRangePicker"

const meta: Meta<typeof DateRangePicker> = {
  title: "Components/DateRangePicker",
  component: DateRangePicker,
  parameters: {
    layout: "centered",
  },
}

export default meta

type Story = StoryObj<typeof DateRangePicker>

export const Default: Story = {
  args: {},
}

export const WithBlackout: Story = {
  args: {
    constraints: {
      blackoutDates: [
        Date.UTC(2026, 0, 10),
        Date.UTC(2026, 0, 15),
      ],
    },
  },
}

export const WithMinMax: Story = {
  args: {
    constraints: {
      min: Date.UTC(2026, 0, 5),
      max: Date.UTC(2026, 0, 25),
    },
  },
}

export const WithDurationLimit: Story = {
  args: {
    constraints: {
      minDurationMs: 2 * 24 * 60 * 60 * 1000,
      maxDurationMs: 7 * 24 * 60 * 60 * 1000,
    },
  },
}
